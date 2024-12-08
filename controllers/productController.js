const Product = require('../models/Product');
const User = require('../models/User');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, seller } = req.body;

        // Find the seller by username
        const user = await User.findOne({ user_name: seller });
        if (!user) {
            return res.status(404).send({ error: "Seller not found" });
        }

        // Create the product with the seller's _id as the owner
        const product = new Product({ name, price, owner: user._id });
        await product.save();

        res.status(201).send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to create product" });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        // Fetch all products and populate the owner field
        const products = await Product.find().populate('owner');
        res.status(200).send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch products" });
    }
};

// Handle a product purchase request
exports.buyProduct = async (req, res) => {
    try {
        const { user_name, productID } = req.body;

        // Find the product by ID
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Find the buyer by username
        const buyer = await User.findOne({ user_name });
        if (!buyer) {
            return res.status(404).send({ error: "Buyer not found" });
        }

        // Find the seller by the product's owner ID
        const seller = await User.findById(product.owner);
        if (!seller) {
            return res.status(404).send({ error: "Seller not found" });
        }

        // Check if the buyer already owns the product
        if (product.owner.toString() === buyer._id.toString()) {
            return res.status(400).send({ msg: `Oops, ${buyer.name} already owns this item` });
        }

        // Check if the buyer has sufficient funds
        if (buyer.balance < product.price) {
            return res.status(400).send({ msg: `Oops, ${buyer.name} has insufficient funds` });
        }

        // Perform the transaction
        buyer.balance -= product.price;
        seller.balance += product.price;
        product.owner = buyer._id;

        // Save the updated documents
        await buyer.save();
        await seller.save();
        await product.save();

        return res.status(200).send({ msg: 'Transaction successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "An error occurred during the transaction" });
    }
};

// Delete a product by name
exports.deleteProduct = async (req, res) => {
    try {
        const { name } = req.params;

        // Find and delete the product by name
        const result = await Product.findOneAndDelete({ name });
        if (!result) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.status(200).send({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to delete product" });
    }
};
