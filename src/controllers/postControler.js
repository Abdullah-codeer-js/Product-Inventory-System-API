const { writefile, readfile } = require('../models/productModel');

exports.postControl = async (req, res, next) => {
    try {
        const productName = req.body.name ?? req.body.prod_name;
        const price = Number(req.body.price);
        const validDate = req.body.valid_date;
        const category = req.body.category;
        const sku = req.body.sku;
        const quantity = Number(req.body.quantity);

        const products = await readfile();
        const val = products.find(itm => itm.sku === sku);

        if (!productName) {
            return res.status(400).json({
                message: 'enter product name'
            });
        }

        if (!price || price < 1) {
            return res.status(400).json({
                message: 'Price can not be less than zero.'
            });
        }

        if (!category) {
            return res.status(400).json({
                message: 'enter product category'
            });
        }

        if (!sku) {
            return res.status(400).json({
                message: 'enter product sku'
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: 'quantity can not be less than zero.'
            });
        }

        if (val) {
            return res.status(409).json({
                message: 'Product SKU already exists'
            });
        }

        const createdProduct = await writefile({
            name: productName,
            prod_name: productName,
            price,
            valid_date: validDate,
            sku,
            quantity,
            category
        });

        console.log('Product created successfully!');

        return res.status(201).json({
            message: 'Product created successfully!',
            product: createdProduct
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error saving data.',
            error: error.message
        });
    }
};