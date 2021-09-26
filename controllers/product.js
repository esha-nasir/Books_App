const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');




exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);

}
exports.create = (req, res) => {
    //we have to handle formidable/multable data here i.e images
    let form = new formidable.IncomingForm()
    form.keepExtensions = true //whateven the image extensions will be true
    form.parse(req, (err, fields, files)=>{
            if(err){
                return res.status(400).json({
                    error: "Image could not be uploaded"
                });
            }

            //check for all fields
            const { name, 
                    description, 
                    price, 
                    category, 
                    quantity,
                    shipping} = fields
            if(!name || 
                !description || 
                !price || 
                !category ||
                !quantity ||
                !shipping){
                    return res.status(400).json({
                        error: "All fields are required"
                    });
                }                    
            let product = new Product(fields)
            // 1K = 1000
            // 1MB = 1000000
            if(files.photo){
                //console.log('FILES PHOTO: ', files.photo);
                //restrict the file size
                if(files.photo.size > 100000){

                    return res.status(400).json({
                        error: "Image should be less than 1MB in size"
                    });

                }
                
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type;
                
            }

            product.save((err,result)=>{
              if(err){
                  return res.status(400).json({
                     error: errorHandler(err)
                  });
              }  
              res.json(result);
            }); 
    });
};


// Remove
exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        res.json({
           //deletedProduct, this will show delete product information 
           "message": "Product Delete Successfully" 
        });
    });
};

// Update
exports.update = (req, res) => {
    //we have to handle formidable/multable data here i.e images
    let form = new formidable.IncomingForm()
    form.keepExtensions = true //whateven the image extensions will be true
    form.parse(req, (err, fields, files)=>{
            if(err){
                return res.status(400).json({
                    error: "Image could not be uploaded"
                });
            }

            //check for all fields
            const { name, 
                    description, 
                    price, 
                    category, 
                    quantity,
                    shipping} = fields
            if(!name || 
                !description || 
                !price || 
                !category ||
                !quantity ||
                !shipping){
                    return res.status(400).json({
                        error: "All fields are required"
                    });
                }                    
            let product = req.product
            product = _.extend(product, fields)
            // 1K = 1000
            // 1MB = 1000000
            if(files.photo){
                //console.log('FILES PHOTO: ', files.photo);
                //restrict the file size
                if(files.photo.size > 100000){

                    return res.status(400).json({
                        error: "Image should be less than 1MB in size"
                    });

                }
                
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type;
                
            }

            product.save((err,result)=>{
              if(err){
                  return res.status(400).json({
                     error: errorHandler(err)
                  });
              }  
              res.json(result);
            }); 
    });
};
