const router = require('express').Router();
const salesController = require('../controller/salesController');

router.post('/addSale', salesController.addSale);
router.get('/getSales', salesController.getSales);
router.get('/getSale/:salesId', salesController.getSale);
router.delete('/deleteSales/:salesId', salesController.deleteSale);

module.exports = router;