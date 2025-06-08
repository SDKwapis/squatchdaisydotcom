const express = require("express");
const router = express.Router();
const { Comic } = require("../models");             // your Sequelize model
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with your Render env vars
cloudinary.config({
  cloud_name:    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:       process.env.CLOUDINARY_API_KEY,
  api_secret:    process.env.CLOUDINARY_API_SECRET,
});

// Use multer-storage-cloudinary to send uploads to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "squatchdaisy-comics",           // optional sub-folder in your Cloudinary account
    allowed_formats: ["jpg", "png", "gif"],   // only allow these file types
    transformation: [{ width: 1200, crop: "limit" }]  // cap max width at 1200px
  }
});

const upload = multer({ storage });

/**
 * POST /api/comics
 * Upload an image to Cloudinary, then save a DB record.
 * Expects multipart/form-data with fields:
 *  - book
 *  - chapter
 *  - pageNumber
 *  - image (the file)
 */
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { book, chapter, pageNumber } = req.body;
    const imageUrl = req.file.path;  // multer-storage-cloudinary returns the URL here

    // Create the comic entry in your database
    const comic = await Comic.create({ 
      book, 
      chapter, 
      pageNumber, 
      imageUrl 
    });

    res.status(201).json(comic);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    next(err);
  }
});

/**
 * GET /api/comics
 * Fetch all comics
 */
router.get("/", async (req, res, next) => {
  try {
    const comics = await Comic.findAll({ order: [["book", "ASC"], ["chapter", "ASC"], ["pageNumber", "ASC"]] });
    res.json(comics);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/comics/:id
 * Delete a comic record (does not remove from Cloudinary)
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await Comic.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

