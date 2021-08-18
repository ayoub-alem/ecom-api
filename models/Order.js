const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        trim: true,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  address: {
    type: String,
    trim: true,
    maxlength: 500,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

// const addOrders = (orderObjectArray) => Order.insertMany(orderObjectArray);

// const findOrdersClient = (OrderId) =>
//   Order.find({ userId: OrderId }).populate('categorieId', 'categorie -_v -_id');

// const findOrdersDashboard = (date) => Order.find({ date: { $eq: date } });

function JoivalidateOrder(req) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.objectId().required(),
        quantity: Joi.number().required(),
      })
    ),
    address: Joi.string().required(),
    phone: Joi.string().required(),
  });

  return schema.validate(req);
}

module.exports = {
  Order,
  JoivalidateOrder,
};
