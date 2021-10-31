// importation de Mongoose
const mongoose = require("mongoose");

// Création du schéma de donnée pour la mise en vente de sauce piquante par l'utilisateur
const thingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  // [ "String <userId>" ] à mettre en place ******************** pour usersLiked et usersDisliked
  usersLiked: { type: String, required: true },
  usersDisliked: { type: String, required: true },
});

// ont exporte le modele de schéma
module.exports = mongoose.model("Thing", thingSchema);
