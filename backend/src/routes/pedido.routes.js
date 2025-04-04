const express = require('express');
const pedidoController = require('../controllers/pedido.controller')
const router = express.Router();

router.post('/', pedidoController.createPedido);
router.get('/', pedidoController.getPedidos);
router.get('/:id', pedidoController.getPedidoById);
router.put('/:id', pedidoController.updatePedido);
router.delete('/:id', pedidoController.deletePedidoById);
router.delete('/', pedidoController.deletePedido);

module.exports = router;
