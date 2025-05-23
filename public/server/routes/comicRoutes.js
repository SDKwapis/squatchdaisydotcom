const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');

router.get('/', comicController.getAll);
router.post('/', comicController.create);
router.delete('/:id', comicController.delete);

module.exports = router;
