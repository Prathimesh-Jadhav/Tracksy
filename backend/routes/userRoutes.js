const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/googleLogin', userController.googleLogin);
router.post('/forgotPassword', userController.forgotPassword);
router.get('/verify/:token', userController.verifyEmailLink);

module.exports = router;

