const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 100,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    _store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    }
});

// Actualiza las fechas de creación y modificación
productSchema.pre('save', function (next) {
    this.lastUpdate = Date.now();
    next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
