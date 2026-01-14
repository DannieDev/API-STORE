const mongoose = require('mongoose');

const saleDetailSchema = new mongoose.Schema({
    _product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { _id: false });

const saleSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productos: [saleDetailSchema],
    _store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    createdAt: {
        type: Number,
        default: () => Date.now()
    },
    lastUpdate: {
        type: Number,
        default: () => Date.now()
    }
});

// Actualiza las fechas de creación y modificación
saleSchema.pre('save', function (next) {
    this.lastUpdate = Date.now();
    next();
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
