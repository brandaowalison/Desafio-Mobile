const express = require('express');
const livroController = require('../controllers/livro.controller');
const router = express.Router();

router.post('/', livroController.createLivro);
router.get('/', livroController.getLivros);
router.get('/:id', livroController.getLivroById);
router.put('/:id', livroController.updateLivro);
router.delete('/', livroController.deleteLivros);
router.delete('/:id', livroController.deleteLivroById);

module.exports = router;


