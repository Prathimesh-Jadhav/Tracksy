const productModel = require("../models/productsModel");

const addProduct = async (req, res) => {
    try {
        // Generate Product ID
        const maxId = await productModel.findOne().sort({ productId: -1 }).exec();
        const nextId = maxId ? Number(maxId.productId) + 1 : 1;

        const { productName, category, items, costPrice, sellingPrice } = req.body;

        // Files from multer
        const imagePath = req.files?.image?.[0]?.path || null;
        const iconPath = req.files?.icon?.[0]?.path || null;

        const newProduct = new productModel({
            productId: nextId,
            productName,
            category,
            items,
            costPrice,
            sellingPrice,
            image: imagePath,
            icon: iconPath,
            associatedOwner: req.user._id
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully" });

    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getProducts = async (req, res) => {
    try {
        const products = await productModel.find({ associatedOwner: req.user._id });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        // Files from multer
        const imagePath = req.files?.image?.[0]?.path || null;
        const iconPath = req.files?.icon?.[0]?.path || null;

        const updateData = {
            ...req.body,
            image: imagePath,
            icon: iconPath
        };

        const product = await productModel.updateOne({ productId: req.params.productId }, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        console.log(product);
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.find({ productId: req.params.productId });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const response = await productModel.deleteOne({ productId: req.params.productId });
        console.log(response);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProducts = async (req, res) => {
    try {
        const updates = req.body;
        console.log("Updates received:", updates);
        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { productId: update.productId },
                update: { $set: update }
            }
        }));
        const result = await productModel.bulkWrite(bulkOps);
        res.status(200).json({ message: "Products updated successfully", result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { addProduct, getProducts, getProduct, updateProduct, deleteProduct,updateProducts };