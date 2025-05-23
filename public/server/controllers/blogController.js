const Blog = require('../models/Blog');

exports.getAll = async (req, res) => {
  const posts = await Blog.findAll({ order: [['date', 'DESC']] });
  res.json(posts);
};

exports.create = async (req, res) => {
  const post = await Blog.create(req.body);
  res.status(201).json(post);
};

exports.delete = async (req, res) => {
  const result = await Blog.destroy({ where: { id: req.params.id } });
  res.json({ deleted: result });
};
