const salesModel = require('../models/salesModel');

const addSale = async (req, res) => {
    //generate Id :
    const maxId = await salesModel.findOne().sort({ productId: -1 }).exec();
    const nextId = maxId ? Number(maxId.saleID) + 1 : 1;
    req.body.saleID = nextId;
    const data = {
        saleID:req.body.saleID,
        customerName: req.body.customerName,
        mobileNumber: req.body.mobileNumber,
        soldProducts: req.body.soldProducts,
        totalAmount: req.body.totalAmount,
        discount: req.body.discount,
        amountPaid: req.body.amountPaid,
        associatedOwner: req.user._id // Assuming req.user is set by the authorization middleware
    }
    try {
        const newSale = await salesModel.create(data);
        return res.status(201).json({ message: "Sale added successfully", newSale });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getSales = async (req, res) => {
    try {
        const sales = await salesModel.find({ associatedOwner: req.user._id }).sort({ soldDate: -1 });
        return res.status(200).json(sales);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getSale = async (req, res) => {
    try {
        const sale = await salesModel.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "Sale not found" });
        }
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteSale = async (req, res) => {
    console.log("Deleting sale with ID:", req.params.salesId);
    try {
        const sale = await salesModel.deleteOne({ saleID: req.params.salesId });
        if (!sale.deletedCount) {
            return res.status(404).json({ error: "Sale not found"});
        }
        return res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { addSale, getSales, getSale, deleteSale };