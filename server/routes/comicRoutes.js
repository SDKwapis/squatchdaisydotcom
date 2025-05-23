const express = require("express");
const router = express.Router();
const comicController = require("../controllers/comicController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ This points to: squatchdaisydotcom/public/comics/
    cb(null, path.join(__dirname, '../../public/comics'));
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '-');
    const uniqueName = Date.now() + '-' + safeName;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Updated POST to handle file upload

router.post("/", upload.single("image"), comicController.createWithImage);
router.get("/", comicController.getAll);
router.delete("/:id", comicController.delete);

module.exports = router;
