const express = require("express");
const { IAMAuth } = require("aloux-iam");
const router = express.Router();

const storeController = require('./controllers/store');
const productController = require('./controllers/product');
const saleController = require('./controllers/sale');

// Tienda
router.post('/stores', storeController.create);
router.get('/stores', storeController.retrieve);
router.get('/stores/paginate', storeController.retrievePaginate);
router.get('/stores/:id', storeController.retrieveById);
router.put('/stores/:id', storeController.update);
router.delete('/stores/:id', storeController.delete);
router.get('/stores/detail/:id', storeController.detail);
router.get('/stores/sales/:id', storeController.getStoreSales);


// Productos
router.post('/products', productController.create);
router.get('/products', productController.retrieve);
router.get('/products/paginate', productController.retrievePaginate);
router.get('/products/:id', productController.retrieveById);
router.patch('/products/:id', productController.update);
router.delete('/products/:id', productController.delete);
router.get('/products/detail/:id', productController.detail);

// Ventas
router.post('/sales', saleController.create);
router.get('/sales', saleController.retrieve);
router.get('/sales/paginate', saleController.retrievePaginate);
router.get('/sales/:id', saleController.retrieveById);
router.put('/sales/:id', saleController.update);
router.patch('/sales/:id/:productId', saleController.updateProductInSale);
router.delete('/sales/:id', saleController.delete);
router.get('/sales/detail/:id',saleController.detail);

module.exports = router;