const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if keys exist
const useCloudinary = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('[CLOUDINARY] Configured successfully. Media will be uploaded to Cloudinary.');
} else {
  console.log('[CLOUDINARY] No keys found in env. Falling back to local storage.');
}

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg/jpg/png/webp) are allowed!'));
};

const uploadRaw = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Wrapper middleware to support Cloudinary uploading dynamically
const upload = {
  single: (fieldname) => {
    const multerMiddleware = uploadRaw.single(fieldname);
    return (req, res, next) => {
      multerMiddleware(req, res, async (err) => {
        if (err) {
          return next(err);
        }

        // If file exists and Cloudinary is configured, upload it
        if (req.file && useCloudinary) {
          try {
            console.log(`[CLOUDINARY] Uploading local file ${req.file.path} to Cloudinary...`);
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'cleannes_uploads',
            });
            
            // Clean up local temp file
            if (fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
            }

            // Update file details to point to Cloudinary secure URL
            req.file.path = result.secure_url;
            req.file.filename = result.secure_url;
          } catch (uploadErr) {
            console.error('[CLOUDINARY ERROR] Failed to upload image:', uploadErr);
            // Fall back to local file path info if Cloudinary upload fails
          }
        }
        next();
      });
    };
  }
};

module.exports = upload;

