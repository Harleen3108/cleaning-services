const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const Blog = require('../models/Blog');

// In-memory visitor simulator
let visitorStats = {
  home: 142,
  about: 48,
  services: 95,
  blog: 63
};

// @desc    Track page visit
// @route   POST /api/analytics/track
// @access  Public
exports.trackVisit = async (req, res) => {
  try {
    const { page } = req.body;
    if (page && visitorStats[page] !== undefined) {
      visitorStats[page] += 1;
    } else if (page) {
      visitorStats[page] = 1;
    }
    res.status(200).json({ success: true, stats: visitorStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics (Admin only)
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Total Bookings
    const totalBookings = await Booking.countDocuments();

    // Total Revenue (only paid bookings or all completed/confirmed)
    const paidBookings = await Booking.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // Total Registered Customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Total Services available
    const totalServices = await Service.countDocuments();

    // Total Blogs
    const totalBlogs = await Blog.countDocuments();

    // Recent Bookings (limit to 5)
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name category price')
      .sort('-createdAt')
      .limit(5);

    // Bookings Status Counts
    const pendingCount = await Booking.countDocuments({ status: 'Pending' });
    const confirmedCount = await Booking.countDocuments({ status: 'Confirmed' });
    const completedCount = await Booking.countDocuments({ status: 'Completed' });
    const cancelledCount = await Booking.countDocuments({ status: 'Cancelled' });

    // Booking Services distribution (aggregate counts)
    const bookings = await Booking.find().populate('service', 'name category');
    const serviceDistribution = {};
    bookings.forEach(b => {
      if (b.service && b.service.name) {
        serviceDistribution[b.service.name] = (serviceDistribution[b.service.name] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        totalCustomers,
        totalServices,
        totalBlogs,
        visitorStats,
        statusBreakdown: {
          Pending: pendingCount,
          Confirmed: confirmedCount,
          Completed: completedCount,
          Cancelled: cancelledCount
        },
        serviceDistribution,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
