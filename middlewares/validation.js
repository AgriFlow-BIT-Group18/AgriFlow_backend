const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Auth Validations
 */
const authValidation = {
    register: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').optional().isIn(['admin', 'distributor', 'farmer', 'customer']).withMessage('Invalid role'),
        validate
    ],
    login: [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
        validate
    ]
};

/**
 * Product Validations
 */
const productValidation = {
    create: [
        body('name').notEmpty().withMessage('Product name is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('stockQuantity').isNumeric().withMessage('Stock quantity must be a number'),
        validate
    ]
};

/**
 * Order Validations
 */
const orderValidation = {
    create: [
        body('orderItems').isArray({ min: 1 }).withMessage('At least one order item is required'),
        body('orderItems.*.product').notEmpty().withMessage('Product ID is required'),
        body('orderItems.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('orderItems.*.name').notEmpty().withMessage('Product name is required'),
        body('orderItems.*.price').isNumeric().withMessage('Product price is required'),
        body('shippingAddress').isObject().withMessage('Shipping address must be an object'),
        body('shippingAddress.address').notEmpty().withMessage('Street address is required'),
        body('shippingAddress.city').notEmpty().withMessage('City is required'),
        body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
        body('shippingAddress.country').notEmpty().withMessage('Country is required'),
        validate
    ]
};

module.exports = {
    authValidation,
    productValidation,
    orderValidation
};
