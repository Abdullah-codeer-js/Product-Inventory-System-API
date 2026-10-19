const { updatefile } = require('../models/productModel');

exports.putController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatefields = {};

        if (req.body.name !== undefined || req.body.prod_name !== undefined) {
            updatefields.name = req.body.name ?? req.body.prod_name;
        }
        if (req.body.price !== undefined) {
            updatefields.price = Number(req.body.price);
        }
        if (req.body.valid_date !== undefined) {
            updatefields.valid_date = req.body.valid_date;
        }
        if (req.body.sku !== undefined) {
            updatefields.sku = req.body.sku;
        }
        if (req.body.quantity !== undefined) {
            updatefields.quantity = Number(req.body.quantity);
        }
        if (req.body.category !== undefined) {
            updatefields.category = req.body.category;
        }

        if (Object.keys(updatefields).length === 0) {
            return res.status(400).json({
                message: 'Validation failed please provide at least one valid field to update.'
            });
        }

        if (updatefields.price !== undefined && updatefields.price < 0) {
            return res.status(400).json({
                message: 'Price cannot be less than 0'
            });
        }

        if (updatefields.quantity !== undefined && updatefields.quantity < 0) {
            return res.status(400).json({
                message: 'Quantity cannot be less than 0.'
            });
        }

        const updatedProduct = await updatefile(id, updatefields);
        if (!updatedProduct) {
            return res.status(404).json({
                message: `Update aborted. Product with ID ${id} was not found.`
            });
        }

        return res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Product update failed', error);
        return res.status(500).json({
            message: 'Server error processing item update.',
            error: error.message
        });
    }
};