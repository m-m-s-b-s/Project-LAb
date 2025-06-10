const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");  // ✅ required for reading file list

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("uploads"));  // serve uploaded files

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    filename: req.file.filename,
    originalname: req.file.originalname,
  });
});

// ✅ Add THIS part at the BOTTOM before app.listen
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Could not read upload folder" });
    }
    res.json(files);
  });
});

// ✅ Server starts here
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
