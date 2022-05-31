const express = require('express')

const CartController = require('../controllers/CartController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, CartController.renderCart);

router.post('/:productId', CartController.addToCart);
router.delete('/:productId', CartController.removeFromCart);
router.put('/:productId/quantity/increment', CartController.incrementProductQuantity);
router.put('/:productId/quantity/decrement', CartController.decrementProductQuantity);

module.exports = router;
