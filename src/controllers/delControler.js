const {deletefile} = require('../models/productModel');

exports.delControler = async (req,res,next)=>{
    try{
        const {id} = req.params;
        const deleteProduct = await deletefile(id);

        if(!deleteProduct){
            return res.status(400).json({
                message: `Delete error. Product with ID ${id} was not found.`
            });
        }
        console.log('Product deleted successfully !');
        return res.status(200).json({
            message: `Product ID ${id} successfully deleted from database`,
            // removedItem: deletedProduct
        });
    }catch (error){
        return res.status(500).json({
            message: `Server error executing data purging sequence. `,
            error: error.message
        });
    }
};
