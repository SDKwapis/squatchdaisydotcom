const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAllPosts);
router.post('/', blogController.createPost);
router.delete('/:id', blogController.deletePost);

module.exports = router;
