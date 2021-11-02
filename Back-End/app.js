// importation d'express
const express = require("express");
// importation de body-parser pour rendre le corp de la requête exploitable en le transformant en objet javascript.
const bodyParser = require("body-parser");
// importation de Mongoose qui facilite les interactions avec notre base de données MongoDB
const mongoose = require("mongoose");
// importation du routeur
const stuffRoutes = require("./routes/stuff");
// importation du routeur login
const userRoutes = require("./routes/user");
// importation de node qui donne accés au chemin du système de fichier
const path = require("path");

// Permet de se relier à la base de donnée MongoDB atlas
mongoose
  .connect(
    "mongodb+srv://Proprietaire:Piiquante@cluster0.vpdpa.mongodb.net/TestSauce?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//création d'une constante pour l'application qui dans l'immédiat ne contiendra rien(ont appelle juste express pour créé une application express)
const app = express();

// Ces headers permettent :
// - d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
// - d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
// - d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

// route des images
app.use("/images", express.static(path.join(__dirname, "images")));
// mise en place du début de la route et pour cette route ont utilise le routeur stuffRoutes
app.use("/api/sauces", stuffRoutes);
// mise en place route pour l'authentification
app.use("/api/auth", userRoutes);

// // middleware, fonction dans l'application qui recoit requête et réponse qui les géres et passe avec next à un prochain middleware
// app.use((req, res, next) => {
//   console.log("Requête reçue !");
//   next();
// });

// // middleware 2
// app.use((req, res, next) => {
//   // modification du code de la réponse Http
//   res.status(201);
//   next();
// });

// // middleware 3
// app.use((req, res, next) => {
//   res.json({ message: "Cool, le serveur fonctionne !" });
//   next();
// });

// // middleware 4
// app.use((req, res) => {
//   console.log("Réponse envoyée avec succés !");
// });

// on exporte l'application (notre constante app)
module.exports = app;
