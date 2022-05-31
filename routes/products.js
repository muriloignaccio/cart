const express = require('express');
const ProductController = require('../controllers/ProductController');
const auth = require('../middlewares/auth');
const router = express.Router();
auth

router.get('/products', auth, ProductController.renderProducts);
router.get('/products/:productId', auth, ProductController.renderSingleProduct);

module.exports = router;