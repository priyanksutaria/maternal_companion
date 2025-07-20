import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration for offline sync batch uploads (CSV, JSON, etc.)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use timestamp + original name for uniqueness
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter for allowed file types (adjust as needed)
const fileFilter = (req, file, cb) => {
  // Accept CSV, JSON, or ZIP files for batch registration sync
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/json" ||
    file.mimetype === "application/zip"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Only CSV, JSON, or ZIP files are allowed for batch sync"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

export default upload;
