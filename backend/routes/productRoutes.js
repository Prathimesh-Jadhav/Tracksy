const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const upload = require('../services/storeFiles');

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 }, // Required
  { name: 'icon', maxCount: 1 }   // Optional
]);

router.post('/addProduct',uploadFields, productController.addProduct);
router.get('/getProducts', productController.getProducts);
router.get('/getProduct/:productId', productController.getProduct);
router.put('/updateProduct/:productId',uploadFields, productController.updateProduct);
router.put('/updateProducts', productController.updateProducts);
router.delete('/deleteProduct/:productId', productController.deleteProduct);

module.exports = router;