const express = require('express');
const CartController = require('../controllers/CartController');
const router = express.Router();
const auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
