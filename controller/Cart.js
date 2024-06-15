const { Cart } = require("../module/Cart");

exports.addToCart = async (req, res) => {
    const cart = new Cart(req.body);
    try {
        const doc = await cart.save();
        const result = await doc.populate('product');
        res.status(201).json(result);
    } catch (err) {
        res.status(401).json(err);
    }
};

exports.fetchCartByUser = async (req, res) => {
    const { user } = req.query;
    try {
        const cartItems = await Cart.find({ user: user }).populate('product');
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.updateCart = async (req, res) => {
    const { id } = req.params;
    const data = req.body
    try {
        const doc = await Cart.findByIdAndUpdate(id, data, { new: true });
        const result = await doc.populate('product');
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.deleteItemFromCart = async (req, res) => {
    const id = req.params;
    try {
        const doc = await Cart.findByIdAndDelete(id);
        res.status(200).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
}