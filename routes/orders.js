const { Order, JoivalidateOrder } = require('../models/Order');
const express = require('express');
const route = express.Router();
const moment = require('moment');
const { Product } = require('../models/Product');
const auth = require('../middlewares/auth');

//***********************************  POST Order  ****************************************/

route.post('/', auth, async (req, res) => {
  //Joi Validation
  const { error } = JoivalidateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let order = { ...req.body };

  //create the order
  try {
    //we create the order
    order = await Order.create(order);

    //we decrement the stock of the products
    req.body.products.map(async (elm) => {
      await Product.findByIdAndUpdate(elm['productId'], {
        $inc: { numberInStock: -elm['quantity'] },
      });
    });
  } catch (ex) {
    //in case there is an exception with the decrement of Products stock
    //we delete the order that we had created

    await Order.findByIdAndDelete(order._id);
    return res.status(400).send('The order cannot be created, ' + ex);
  }

  return res.status(201).send(order);
});

//********************************  GET Order  *********************************************/

route.get('/', auth, async (req, res) => {
  let orders;

  //get the first of the day and the last of the day
  let today = moment().startOf('month');
  let lastToday = moment().endOf('month');
  console.log(lastToday);

  try {
    orders = await Order.find({
      date: { $gte: today, $lte: lastToday },
    })
      .populate({
        path: 'products',
        populate: {
          path: 'productId',
          model: 'Product',
          select: 'categorieId title _id price',
        },
      })
      .populate('userId', 'username email isAdmin');
  } catch (ex) {
    return res.status(500).send(ex);
  }

  if (!orders) return res.status(404).send('No such orders');

  res.status(200).send(orders);
});

module.exports = route;
