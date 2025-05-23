const db = require('../db');

exports.getAllPosts = (req, res) => {
  db.all('SELECT * FROM blog_posts ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createPost = (req, res) => {
  const { title, date, content } = req.body;
  db.run(
    'INSERT INTO blog_posts (title, date, content) VALUES (?, ?, ?)',
    [title, date, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.deletePost = (req, res) => {
  db.run('DELETE FROM blog_posts WHERE id = ?', req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};
