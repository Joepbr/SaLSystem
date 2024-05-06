import multer from 'multer';

// Define storage for uploaded files
const storage = multer.memoryStorage();

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // limit file size to 50MB
  },
});

export default upload;
