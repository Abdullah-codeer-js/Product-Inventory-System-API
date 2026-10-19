const { readfile} = require('../models/productModel');

exports.getControler = async (req,res,next) =>{
    try{
        const products = await readfile();
        const items =products.filter(itm =>itm.quantity <5)
        if(!products || products.length === 0){
            return res.status(404).json({
                message:'No products found in DataBase.'
            });
        }
        console.log('Produc shown successfully!');
        return res.status(200).json({
            products,
        });
    }catch(error){
        return res.status(500).json({
            message:'Server error fetching data.',
            error:error.message
        });
    }
};