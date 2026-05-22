const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name category price subcategory')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('service', 'name category price subcategory')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private/Public (allowing bookings with optional user field)
exports.createBooking = async (req, res) => {
  try {
    const { 
      serviceId, 
      dateTime, 
      name, 
      email, 
      phone, 
      description, 
      latitude, 
      longitude, 
      formattedAddress, 
      customization 
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Estimate pricing calculation
    let extraRoomsCount = customization?.extraRooms ? Number(customization.extraRooms) : 0;
    let hasBalconyOpt = customization?.hasBalcony ? true : false;

    // Add Indian rupees surcharge estimation
    let minEst = (service.minPrice || 299) + (extraRoomsCount * 500) + (hasBalconyOpt ? 350 : 0);

    const booking = await Booking.create({
      user: req.user ? req.user.id : null,
      service: serviceId,
      dateTime,
      name,
      email,
      phone,
      description,
      latitude,
      longitude,
      formattedAddress,
      customization: {
        extraRooms: extraRoomsCount,
        hasBalcony: hasBalconyOpt,
        notes: customization?.notes || ''
      },
      totalAmount: minEst,
      status: 'Pending'
    });

    // Send booking confirmation email immediately
    if (email) {
      const { sendBrevoEmail } = require('../utils/notificationService');
      const scheduledDate = new Date(dateTime).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });

      const confirmHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #2563eb, #059669); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 1.6em;">Booking Request Received!</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">We have received your service request</p>
          </div>
          <div style="padding: 25px;">
            <p style="font-size: 1em;">Dear <strong>${name}</strong>,</p>
            <p>Thank you for booking with <strong>Cleannes India</strong>. Your service request has been submitted and is <strong>pending admin review</strong>. You will receive another email once it is approved or reviewed.</p>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin: 0 0 12px; color: #1e293b;">Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95em;">
                <tr><td style="padding: 6px 0; font-weight: bold; width: 160px; color: #64748b;">Booking ID:</td><td style="padding: 6px 0; color: #1e293b;">${booking._id}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #64748b;">Service:</td><td style="padding: 6px 0; color: #1e293b;">${service.name}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #64748b;">Scheduled Date:</td><td style="padding: 6px 0; color: #1e293b;">${scheduledDate}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #64748b;">Location:</td><td style="padding: 6px 0; color: #1e293b;">${formattedAddress}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #64748b;">Estimated Price:</td><td style="padding: 6px 0; color: #059669; font-weight: bold;">₹${(service.minPrice || 299).toLocaleString('en-IN')} – ₹${(service.maxPrice || 499).toLocaleString('en-IN')}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #64748b;">Status:</td><td style="padding: 6px 0;"><span style="background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 20px; font-size: 0.85em;">Pending Review</span></td></tr>
              </table>
            </div>

            <p style="color: #64748b; font-size: 0.9em;">Our team will review your request and notify you via email and WhatsApp. No payment is required at this stage.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 0.85em; color: #94a3b8;">Best Regards,<br/><strong>Cleannes Cleaning Services Team</strong></p>
          </div>
        </div>
      `;

      sendBrevoEmail({
        toEmail: email,
        toName: name,
        subject: `Booking Confirmed – ${service.name} | Cleannes India`,
        htmlContent: confirmHtml
      }).catch(err => console.error('[BOOKING EMAIL ERROR]', err));
    }

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, staff, statusReason } = req.body;

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    if (status) booking.status = status;
    if (staff !== undefined) booking.staff = staff;
    if (statusReason !== undefined) booking.statusReason = statusReason;

    await booking.save();

    booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('service', 'name category minPrice maxPrice subcategory');

    // Trigger Notifications on status state transitions (Approved/Disapproved)
    if (status && status !== oldStatus) {
      const { sendBrevoEmail, sendWhatsAppMessage } = require('../utils/notificationService');

      const clientName = booking.name || 'Customer';
      const clientEmail = booking.email;
      const clientPhone = booking.phone;
      const serviceName = booking.service?.name || 'Cleaning Service';
      const scheduledDate = new Date(booking.dateTime).toLocaleString('en-IN');
      const reasonText = statusReason || 'None provided';

      if (status === 'Approved') {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
            <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">Booking Approved!</h2>
            <p>Dear ${clientName},</p>
            <p>Great news! Your service booking request has been <strong>Approved</strong> by the administrator.</p>
            <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Service Name:</td>
                <td style="padding: 8px 0;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date & Time:</td>
                <td style="padding: 8px 0;">${scheduledDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Address Location:</td>
                <td style="padding: 8px 0;">${booking.formattedAddress}</td>
              </tr>
              ${booking.staff ? `<tr><td style="padding: 8px 0; font-weight: bold;">Assigned Staff:</td><td style="padding: 8px 0;">${booking.staff}</td></tr>` : ''}
            </table>
            <p style="margin-top: 20px;">Our cleaning crew will reach your premises on time. If you have any queries, feel free to contact us.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 0.85em; color: #64748b;">Best Regards,<br/>Cleannes Cleaning Services Team</p>
          </div>
        `;
        
        // Trigger Brevo Email Async
        sendBrevoEmail({
          toEmail: clientEmail,
          toName: clientName,
          subject: `Cleannes Booking Approved: ${serviceName}`,
          htmlContent: emailHtml
        });

        // Trigger WhatsApp Notification
        const waMsg = `Hello ${clientName}, your request for ${serviceName} on ${scheduledDate} has been APPROVED by Cleannes! Staff assigned: ${booking.staff || 'TBA'}. Location: ${booking.formattedAddress}. Thank you!`;
        sendWhatsAppMessage({
          toPhone: clientPhone,
          message: waMsg
        });

      } else if (status === 'Disapproved') {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
            <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Booking Disapproved</h2>
            <p>Dear ${clientName},</p>
            <p>We regret to inform you that your cleaning service request has been <strong>Disapproved</strong> by the administrator.</p>
            <p style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; font-style: italic; color: #991b1b; margin: 15px 0;">
              <strong>Reason for Disapproval:</strong> ${reasonText}
            </p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Service Name:</td>
                <td style="padding: 8px 0;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date & Time:</td>
                <td style="padding: 8px 0;">${scheduledDate}</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">You can place a new request or contact support at support@cleannes.in to discuss further details.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 0.85em; color: #64748b;">Best Regards,<br/>Cleannes Cleaning Services Team</p>
          </div>
        `;

        // Trigger Brevo Email Async
        sendBrevoEmail({
          toEmail: clientEmail,
          toName: clientName,
          subject: `Cleannes Booking Disapproved: ${serviceName}`,
          htmlContent: emailHtml
        });

        // Trigger WhatsApp Notification
        const waMsg = `Hello ${clientName}, we regret to inform you that your booking for ${serviceName} on ${scheduledDate} has been DISAPPROVED. Reason: ${reasonText}. Please contact support for options.`;
        sendWhatsAppMessage({
          toPhone: clientPhone,
          message: waMsg
        });
      }
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
