const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const hostController = require("../controllers/hostController");
const isAuth = require("../controllers/isAuth");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads")); // সব ছবি uploads ফোল্ডারে
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Multer instance
const upload = multer({
  storage,
  limits: {
    fieldSize: 100 * 1024 * 1024, // Description এর মতো বড় টেক্সটের জন্য
    fileSize: 10 * 1024 * 1024,   // প্রতিটি ছবির max 10MB
  },
});


router.get("/add-blog", isAuth, hostController.getAddBlog);
router.post(
  "/blog/addAllBlogs",
  upload.single("image"),
  hostController.postAddBlog
);

// CKEditor image upload (for description এর মধ্যে images)
router.post(
  "/blog/upload-image",
  upload.single("upload"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
      uploaded: true,
      url: "/uploads/" + req.file.filename,
    });
  }
);

// ===========

router.post(
  "/blog/delete/:id",
  hostController.deleteBlog
)


// Edit blog page
router.get("/blog/edit/:id", isAuth, hostController.getEditBlogs);

// Update blog
router.post("/blog/edit/:id", isAuth, upload.single("image"), hostController.postEditBlogs);

// Contact form
router.get("/contact-form", isAuth, hostController.getContactForm);

// /contacts/delete/:id
router.post("/contacts/delete/:id", hostController.deleteContact);

module.exports = router;
