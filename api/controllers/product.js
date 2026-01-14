const Product = require('../models/Product');
const mongoose = require('mongoose');

const self = module.exports;

// Crear un nuevo producto
self.create = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los productos
self.retrieve = async (req, res) => {
    try {
        const filter = {};
        if (req.query.store_id) {
            filter._store = req.query.store_id;
        }
        const products = await Product.find(filter).populate('_store').lean();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un producto por ID
self.retrieveById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Permite paginar los productos
self.retrievePaginate = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const itemsPerPage = parseInt(req.body.itemsPerPage) || 10;
        const filter = {};
        if (req.query.store_id) {
            filter._store = req.query.store_id;
        }

        const response = await Product.find(filter).lean()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .populate('_store');

        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Obtener detalle de un producto y su tienda
self.detail = async (req, res) => {
    try {
        const _id = req.params.id;

        const response = await Product.findById(_id).populate('_store').lean();

        if (!response) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Actualizar un producto
self.update = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un producto
self.delete = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
