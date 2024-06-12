const { User } = require("../module/User");

exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const doc = await user.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }, 'id email role password');
        if (!user) {
            res.status(401).json({ message: 'no such user email' });
        } else if (user.password === req.body.password) {
            res.status(200).json({ id: user.id, email: user.email, role: user.role, addresses: user.addresses });
        }
        else {
            res.status(401).json({ message: 'invalid credentials' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
}