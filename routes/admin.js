const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
//This is actually /admin/add-products => GET
router.get('/add-product', productsController.getAddProduct);

//This is actually /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

// exports.routes = router;
// exports.products = products;

module.exports = router;
