const User = require('../models/User');
const Product = require('../models/Product');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, user_name, balance } = req.body;
        const user = new User({ name, user_name, balance });
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to create user" });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch users" });
    }
};

// Get a single user
exports.getUser = async (req, res) => {
    try {
        const { user_name } = req.params;
        const user = await User.findOne({ user_name }).populate('items');
        if (!user) return res.status(404).send({ error: "User not found" });
        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch user" });
    }
};

// Delete a user and their items
exports.deleteUser = async (req, res) => {
    try {
        const { user_name } = req.params;
        const user = await User.findOne({ user_name });
        if (!user) return res.status(404).send({ error: "User not found" });
        await Product.deleteMany({ owner: user._id });
        await User.deleteOne({ _id: user._id });
        res.status(200).send({ message: "User and their items deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to delete user and their items" });
    }
};

// Get summary of all users and their items
exports.getSummary = async (req, res) => {
    try {
        const users = await User.find().populate('items');
        const summary = users.map((user) => ({
            user_name: user.user_name,
            balance: user.balance,
            items: user.items.map((item) => ({
                name: item.name,
                price: item.price,
            })),
        }));
        res.status(200).send(summary);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch summary" });
    }
};
