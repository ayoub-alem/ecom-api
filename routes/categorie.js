const { Categorie, joiValidateCategorie } = require('../models/Categorie');
const _ = require('lodash');
const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

//****************Post Categorie**************************************************

route.post('/', [auth, isAdmin], async (req, res) => {
  //Joi Validation
  const { error } = joiValidateCategorie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the Categorie exist
  let categorie = _.startCase(_.toLower(req.body.categorie));
  const newCategorie = await Categorie.findOne({ categorie });
  if (newCategorie)
    return res.status(400).send('Categorie already exist wit the same name');

  //create new Categorie
  categorie = await Categorie.create({ categorie });
  res.status(201).send(categorie);
});

//****************Get Categories**************************************************

route.get('/', async (req, res) => {
  //search for the Categories
  const categories = await Categorie.find().select('categorie _id');

  //in case the categorie not founded
  if (categories.length === 0)
    return res.status(404).send('Categorie not found');

  res.status(200).send(categories);
});

//****************Delete Categorie**************************************************

route.delete('/:id', [auth, isAdmin], async (req, res) => {
  //search for the Categorie
  const categoryId = req.params.id;
  let categorie;

  try {
    categorie = await Categorie.findByIdAndRemove(categoryId);
  } catch (ex) {
    //in case the categorie not founded
    return res.status(404).send('Categorie not found');
  }

  res.status(200).send(categorie);
});

//****************Update Categorie**************************************************

route.put('/:id', [auth, isAdmin], async (req, res) => {
  //search for the Categorie
  const categorieId = req.params.id;
  const categorieUpdated = req.body;
  let categorie;

  try {
    categorie = await Categorie.findByIdAndUpdate(
      categorieId,
      { $set: categorieUpdated },
      { new: true }
    );
  } catch (ex) {
    //in case the Categorie not founded or not Updated successfully
    return res.status(404).send('Categorie not found');
  }

  //in case of success
  res.status(200).send(categorie);
});

//****************Export Route**************************************************

module.exports = route;
