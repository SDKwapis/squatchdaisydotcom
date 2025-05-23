const fs = require('fs');
const path = require('path');
const Comic = require('../models/Comic');

exports.getAll = async (req, res) => {
  try {
    const pages = await Comic.findAll({
      order: [
        ["book", "ASC"],
        ["chapter", "ASC"],
        ["pageNumber", "ASC"],
      ],
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { book, chapter, pageNumber, imageUrl } = req.body;
    const newPage = await Comic.create({ book, chapter, pageNumber, imageUrl });
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.delete = async (req, res) => {
  try {
    const comic = await Comic.findByPk(req.params.id);

    if (!comic) {
      return res.status(404).json({ error: 'Comic not found.' });
    }

    // Build full path to image file
    const imagePath = path.join(__dirname, '../../public', comic.imageUrl);

    // Delete the image file
    fs.unlink(imagePath, async (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ error: 'Failed to delete image file.' });
      }

      // Delete from database
      await comic.destroy();
      res.json({ message: 'Comic and image deleted.' });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createWithImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const book = parseInt(req.body.book);
    const chapter = parseInt(req.body.chapter);
    const pageNumber = parseInt(req.body.pageNumber);
    const imageUrl = `/comics/${req.file.filename}`;

    if (isNaN(book) || isNaN(chapter) || isNaN(pageNumber)) {
      return res.status(400).json({ error: "Invalid comic metadata." });
    }

    const newPage = await Comic.create({ book, chapter, pageNumber, imageUrl });
    res.status(201).json(newPage);
  } catch (error) {
    console.error("Upload error:", error); // 👈 Add this for easier debugging
    res.status(500).json({ error: error.message });
  }
};
