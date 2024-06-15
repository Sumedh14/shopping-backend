const { Product } = require("../module/Product");

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    console.log(response);
    try {
        const response = await product.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err)
    }
};


exports.fetchAllProducts = async (req, res) => {
    try {
        let query = Product.find({ deleted: { $ne: true } });
        let totalProductsQuery = Product.find({ deleted: { $ne: true } });

        if (req.query.category) {
            query = query.find({ category: req.query.category });
            totalProductsQuery = totalProductsQuery.find({ category: req.query.category });
        }
        if (req.query.brand) {
            query = query.find({ brand: req.query.brand });
            totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
        }
        if (req.query._sort && req.query._order) {
            query = query.sort({ [res.query._sort]: req.query._order })
        }

        let totalDocs = await totalProductsQueryuery.count().exec();

        if (req.query._page && req.query._limit) {
            const pageSize = req.query._limit;
            const page = req.query._page
            query = query.skip(pageSize * (page - 1)).limit(pageSize);
        }


        const doc = await query.exec();
        res.set('X-Total-Coutn', totalDocs);
        res.status(200).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.fetchProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json(err);

    }
};