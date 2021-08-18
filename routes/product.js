const { Product, joiValidateProduct } = require('../models/Product');
const _ = require('lodash');
const express = require('express');
const route = express.Router();
const { uploadMiddleware, removeFile } = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

//****************Post Product**************************************************

route.post('/', [auth, isAdmin, uploadMiddleware], async (req, res) => {
  //check if the img is sent
  if (!req.file) return res.status(400).send('Product image is required');

  //Joi Validation
  const { error } = joiValidateProduct(req.body);
  if (error) {
    removeFile(req.file.path);
    return res.status(400).send(error.details[0].message);
  }

  //check if the product exist
  let title = _.startCase(_.toLower(req.body.title));
  const newProduct = await Product.findOne({ title });
  if (newProduct) {
    removeFile(req.file.path);
    return res.status(400).send('Product already exist');
  }

  //create new Product
  let product = { ...req.body };
  product.title = title;
  product.img = req.file.path;
  try {
    product = await Product.create(product);
  } catch (ex) {
    //if the product didn't created
    removeFile(product.img);
    return res.status(500).send('Product Cannot created');
  }

  //else
  res.status(201).send(product);
});

//****************Get Products**************************************************

route.get('/', async (req, res) => {
  //find Products
  const products = await Product.find().populate('categorieId', 'categorie');

  //in case the products collection empty
  if (products.length === 0) return res.status(404).send('There is no product');

  //in case there is at least one product in the collection
  res.status(200).send(products);
});

//****************Delete Product**************************************************

route.delete('/:id', [auth, isAdmin], async (req, res) => {
  //search for the product
  const productId = req.params.id;
  let product;

  try {
    product = await Product.findByIdAndRemove(productId);
  } catch (ex) {
    //in case the product not founded
    return res.status(404).send('Product not found');
  }

  //in case the product founded and removed successfully we remove the img of that product
  removeFile(product.img);
  res.status(200).send(product);
});

//****************Update Product**************************************************

route.put('/:id', [auth, isAdmin, uploadMiddleware], async (req, res) => {
  //check if the img is sent
  if (!req.file) return res.status(400).send('Product image is required');

  //Joi Validation
  const { error } = joiValidateProduct(req.body);
  if (error) {
    removeFile(req.file.path);
    return res.status(400).send(error.details[0].message);
  }

  const productId = req.params.id;
  let productUpdated = req.body;
  productUpdated.img = req.file.path;

  let product, imgOldPath;
  try {
    const { img } = await Product.findById(productId);
    imgOldPath = img;
    product = await Product.findByIdAndUpdate(
      productId,
      { $set: productUpdated },
      { new: true }
    );
  } catch (ex) {
    removeFile(productUpdated.img);
    return res.status(404).send('Product not found');
  }

  removeFile(imgOldPath);
  res.status(200).send(product);
});

//******************exporting the route**********
module.exports = route;
