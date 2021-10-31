// importation de mongoose
const mongoose = require("mongoose");

// ajout du validator pour notre Schema
const uniqueValidator = require("mongoose-unique-validator");

// création du schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// ont applique le validateur au schema avant d'en faire un model
userSchema.plugin(uniqueValidator);

//ont exporte
module.exports = mongoose.model("User", userSchema);
