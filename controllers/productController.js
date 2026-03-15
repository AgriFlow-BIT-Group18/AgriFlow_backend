const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('farmer', 'name farmName');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer', 'name farmName');
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    const { name, description, category, price, stockQuantity, minThreshold, unit, imageUrl } = req.body;
    try {
        // Ensuring only farmer or admin can create product
        if (req.user.role !== 'farmer' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to create product' });
        }

        // Check if product already exists for this user (same name, category, unit)
        const existingProduct = await Product.findOne({
            farmer: req.user._id,
            name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive match
            category,
            unit
        });

        if (existingProduct) {
            // Update existing product stock
            existingProduct.stockQuantity += Number(stockQuantity || 0);
            existingProduct.price = price !== undefined ? price : existingProduct.price;
            existingProduct.description = description || existingProduct.description;
            existingProduct.minThreshold = minThreshold !== undefined ? minThreshold : existingProduct.minThreshold;
            existingProduct.imageUrl = imageUrl || existingProduct.imageUrl;

            const updatedProduct = await existingProduct.save();
            return res.status(200).json(updatedProduct);
        }

        const product = new Product({
            farmer: req.user._id,
            name,
            description,
            category,
            price,
            stockQuantity,
            minThreshold,
            unit,
            imageUrl
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { name, description, category, price, stockQuantity, minThreshold, unit, imageUrl } = req.body;
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if it's the right farmer or admin
            if (req.user.role !== 'admin' && product.farmer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to edit this product' });
            }

            product.name = name || product.name;
            product.description = description || product.description;
            product.category = category || product.category;
            product.price = price !== undefined ? price : product.price;
            product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
            product.minThreshold = minThreshold !== undefined ? minThreshold : product.minThreshold;
            product.unit = unit || product.unit;
            product.imageUrl = imageUrl || product.imageUrl;

            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if it's the right farmer or admin
            if (req.user.role !== 'admin' && product.farmer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this product' });
            }
            await product.deleteOne();
            res.status(200).json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};
