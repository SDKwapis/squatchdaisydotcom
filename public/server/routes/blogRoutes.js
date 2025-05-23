const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAll);
router.post('/', blogController.create);
router.delete('/:id', blogController.delete);

module.exports = router;
