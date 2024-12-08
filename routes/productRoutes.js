const express = require('express');
const router = express.Router();
const { createProduct, getProducts, buyProduct, deleteProduct } = require('../controllers/productController');

// Product routes
router.post('/products', createProduct);
router.get('/products', getProducts);
router.post('/products/buy', buyProduct);
router.delete('/products/:name', deleteProduct);

module.exports = router;
