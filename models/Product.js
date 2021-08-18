const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
  categorieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',
    required: true,
  },
  title: {
    type: String,
    maxlength: 50,
    trim: true,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    max: 1000,
    min: 0,
    trim: true,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

function joiValidateProduct(req) {
  const schema = Joi.object({
    categorieId: Joi.objectId().required(),
    title: Joi.string().min(5).max(50).required(),
    price: Joi.number().max(1000).min(0).required(),
    numberInStock: Joi.number().min(0).required(),
  });

  return schema.validate(req);
}

module.exports = {
  joiValidateProduct,
  Product,
};
