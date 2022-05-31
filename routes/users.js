const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.get('/register', UserController.renderRegister);
router.post('/register', UserController.createUser);

router.get('/login', UserController.renderLogin);
router.post('/login', UserController.authenticate);

module.exports = router;
