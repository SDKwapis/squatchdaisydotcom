const Blog = require('../models/Blog');

exports.getAll = async (req, res) => {
  const posts = await Blog.findAll({ order: [['createdAt', 'DESC']] });
  res.json(posts);
};

exports.create = async (req, res) => {
  const post = await Blog.create(req.body);
  res.status(201).json(post);
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Blog.destroy({ where: { id: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

