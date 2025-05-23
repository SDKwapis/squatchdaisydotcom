const Comic = require('../models/Comic');

exports.getAll = async (req, res) => {
  try {
    const pages = await Comic.findAll({
      order: [['book', 'ASC'], ['chapter', 'ASC'], ['pageNumber', 'ASC']],
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
    const deleted = await Comic.destroy({ where: { id: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
