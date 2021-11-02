// importation de Mongoose
const mongoose = require("mongoose");

// Création du schéma de donnée pour la mise en vente de sauce piquante par l'utilisateur
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  // [ "String <userId>" ] à mettre en place ******************** pour usersLiked et usersDisliked
  usersLiked: { type: ["String <userId>"], required: false },
  usersDisliked: { type: ["String <userId>"], required: false },
});

// ont exporte le modele de schéma
module.exports = mongoose.model("Sauce", sauceSchema);
