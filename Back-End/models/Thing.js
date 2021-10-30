// importation de Mongoose
const mongoose = require("mongoose");

// Création du schéma de donnée pour la mise en vente de sauce piquante par l'utilisateur
const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  userId: { type: String, required: true },
});

// ont exporte le modele de schéma
module.exports = mongoose.model("Thing", thingSchema);
