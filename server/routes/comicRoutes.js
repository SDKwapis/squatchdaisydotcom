// server/routes/comicRoutes.js
require('dotenv').config();                   // ensure .env (locally) or Render envs get loaded
const express = require('express');
const router = express.Router();

// 1) Import your Comic model
//    This assumes your models/index.js exports { Comic, Blog, User, sequelize }
const { Comic } = require('../models');

// 2) Cloudinary + multer-storage-cloudinary setup
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// sanity‐check your env vars early:
console.log('⚙️  CLOUDINARY_API_KEY loaded?', !!process.env.CLOUDINARY_API_KEY);

// configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'squatchdaisy-comics',
    allowed_formats: ['jpg','png','gif'],
    transformation: [{ width: 1200, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// 3) Routes

// POST /api/comics — upload & create
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const { book, chapter, pageNumber } = req.body;
    console.log('📦 New comic upload:', { book, chapter, pageNumber, file: req.file });

    const imageUrl = req.file.path;             // Cloudinary URL
    const comic = await Comic.create({ book, chapter, pageNumber, imageUrl });

    return res.status(201).json(comic);
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/comics — list all
router.get('/', async (req, res) => {
  try {
    // make sure Comic is defined
    if (!Comic) {
      throw new Error('COMIC model is undefined');
    }
    const comics = await Comic.findAll({
      order: [['book', 'ASC'], ['chapter', 'ASC'], ['pageNumber', 'ASC']]
    });
    return res.json(comics);
  } catch (err) {
    console.error('Fetch comics error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/comics/:id — remove record
router.delete('/:id', async (req, res) => {
  try {
    await Comic.destroy({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    console.error('Delete comic error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;


