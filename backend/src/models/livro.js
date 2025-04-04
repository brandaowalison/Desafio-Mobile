const mongoose = require('mongoose');

const LivroSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    author:{ type: String, required: true, trim: true},
    publisher: { type: String, required: true},
    publication_year: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear(),
        required: true
    },
    genre: { type: String, trim: true },
    available: { type: Boolean, default: true },
    posterUrl: { type: String, required: true,}
}, {timestamps: true });

const Livro = mongoose.model('Livro', LivroSchema);

module.exports = Livro;