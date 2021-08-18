const mongoose = require('mongoose');
const Joi = require('joi');

const categoriSchema = new mongoose.Schema({
  categorie: {
    type: String,
    maxlength: 50,
    minlength: 3,
    required: true,
  },
});

const Categorie = mongoose.model('Categorie', categoriSchema);

function joiValidateCategorie(req) {
  const schema = Joi.object({
    categorie: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(req);
}

module.exports = {
  Categorie,
  joiValidateCategorie,
};
