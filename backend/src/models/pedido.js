const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    order_date: { type: Date, default: Date.now },
    total_amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pendente', 'preparando', 'entregue', 'cancelado'], default: 'pendente'},
    items: [{
        book: { type: mongoose.Schema.ObjectId, ref: 'Livro', required: true},
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
    }]
}, { timestamps: true });

const Pedido = mongoose.model('Pedido', PedidoSchema);

module.exports = Pedido;