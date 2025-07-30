const express = require("express");
const router = express.Router();
const multer = require("multer");
const { handleUpload, checkDuplicates } = require("../controllers/uploadController");

// Multer storage config (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route: POST /api/upload - For file uploads
router.post("/", upload.single("file"), handleUpload);

// Route: POST /api/upload/check-duplicates - For pre-upload duplicate checking
router.post("/check-duplicates", checkDuplicates);

module.exports = router;