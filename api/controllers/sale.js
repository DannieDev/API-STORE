const Sale = require('../models/Sale');

const self = module.exports;

// Crear una nueva venta
self.create = async (req, res) => {
    try {
        const sale = new Sale(req.body);
        const savedSale = await sale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las ventas
self.retrieve = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('_store')
            .populate('productos._product')
            .lean();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una venta por ID
self.retrieveById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).lean();
        if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener detalle de una venta
self.detail = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('_store')
            .populate('productos._product')
            .lean();
        if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Permite paginar las ventas
self.retrievePaginate = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const itemsPerPage = parseInt(req.body.itemsPerPage) || 10;

        const response = await Sale.find().lean()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .populate('_store')
            .populate('productos._product');

        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Actualizar una venta
self.update = async (req, res) => {
    try {
        // Aseguramos que lastUpdate se actualice
        req.body.lastUpdate = Date.now();
        const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un producto dentro de una venta
self.updateProductInSale = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const { quantity, total } = req.body;

        const sale = await Sale.findById(id);

        if (!sale) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        const productItem = sale.productos.find(p => p._product.toString() === productId);

        if (!productItem) {
            return res.status(404).json({ message: 'Producto no encontrado en esta venta' });
        }

        if (quantity !== undefined) productItem.quantity = quantity;
        if (total !== undefined) productItem.total = total;

        sale.total = sale.productos.reduce((acc, item) => acc + parseFloat(item.total), 0);
        sale.lastUpdate = Date.now();

        await sale.save();

        const populatedSale = await Sale.findById(id).populate('_store').populate('productos._product');
        res.json(populatedSale);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una venta
self.delete = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
        res.json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
