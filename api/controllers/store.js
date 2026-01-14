const Store = require('../models/Store');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const mongoose = require('mongoose');

const self = module.exports;

// Crear una nueva tienda
self.create = async (req, res) => {
    try {
        const store = new Store(req.body);
        const savedStore = await store.save();
        res.status(201).json(savedStore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las tiendas
self.retrieve = async (req, res) => {
    try {
        const stores = await Store.find().lean();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una tienda por ID
self.retrieveById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id).lean();
        if (!store) return res.status(404).json({ message: 'Tienda no encontrada' });
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Permite paginar las tiendas
self.retrievePaginate = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const itemsPerPage = parseInt(req.body.itemsPerPage) || 10;

        const response = await Store.find().lean()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Permite obtener el detalle de una tienda
self.detail = async (req, res) => {
    try {
        const _id = req.params.id;

        const response = await Store.findById(_id).populate('products').lean();

        if (!response) {
            return res.status(404).json({ message: 'Tienda no encontrada' });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
};


// Actualizar una tienda
self.update = async (req, res) => {
    try {
        req.body.lastUpdate = Date.now();
        const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!store) return res.status(404).json({ message: 'Tienda no encontrada' });
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener ventas totales de una tienda
self.getStoreSales = async (req, res) => {
    try {
        const _id = req.params.id;

        const store = await Store.findById(_id).populate('sales').lean();

        if (!store) {
            return res.status(404).json({ message: 'Tienda no encontrada' });
        }

        const sales = store.sales || [];
        const moneyTotal = sales.reduce((acc, sale) => acc + parseFloat(sale.total), 0);
        const quantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);
        const salesCount = sales.length;

        res.json({
            _id: store._id,
            name: store.name,
            moneyTotal: moneyTotal,
            quantity: quantity,
            salesCount: salesCount,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una tienda
self.delete = async (req, res) => {
    try {
        const store = await Store.findByIdAndDelete(req.params.id);
        if (!store) return res.status(404).json({ message: 'Tienda no encontrada' });
        res.json({ message: 'Tienda eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
