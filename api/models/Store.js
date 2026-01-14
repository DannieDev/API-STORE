const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
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

storeSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: '_store'
});

storeSchema.virtual('sales', {
    ref: 'Sale',
    localField: '_id',
    foreignField: '_store'
});

// Actualiza las fechas de creación y modificación
storeSchema.pre('save', function (next) {
    this.lastUpdate = Date.now();
    next();
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
