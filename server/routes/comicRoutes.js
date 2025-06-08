// server/routes/comicRoutes.js
require('dotenv').config();                // only affects local .env; Render uses REAL env vars
const express = require('express');
const router = express.Router();

// 1) Load your Comic model directly
const Comic = require('../models/Comic');  // adjust path if your model file is named differently

// 2) Cloudinary + multer-storage-cloudinary setup
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 2a) Sanity check your Render env-vars for Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
  console.error('⚠️ Missing one of CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in env!');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'squatchdaisy-comics',
    allowed_formats: ['jpg','png','gif'],
    transformation: [{ width: 1200, crop: 'limit' }],
  }
});

const upload = multer({ storage });

// 3) Routes

// POST /api/comics — upload & save
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const { book, chapter, pageNumber } = req.body;
    console.log('📦 New comic upload:', { book, chapter, pageNumber, file: req.file.path });

    // req.file.path is the Cloudinary URL
    const comic = await Comic.create({
      book,
      chapter,
      pageNumber,
      imageUrl: req.file.path
    });

    return res.status(201).json(comic);
  } catch (err) {
    console.error('❌ /api/comics POST error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/comics — list all
router.get('/', async (req, res) => {
  try {
    if (!Comic) throw new Error('Comic model not loaded');
    const comics = await Comic.findAll({
      order: [['book','ASC'], ['chapter','ASC'], ['pageNumber','ASC']]
    });
    return res.json(comics);
  } catch (err) {
    console.error('❌ /api/comics GET error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/comics/:id — remove record
router.delete('/:id', async (req, res) => {
  try {
    await Comic.destroy({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    console.error('❌ /api/comics DELETE error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;



