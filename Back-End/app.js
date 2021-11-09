// importation d'express et (body-parser pour rendre le corp de la requête exploitable en le transformant en objet javascript).
const express = require("express");
// importation de Mongoose qui facilite les interactions avec notre base de données MongoDB
const mongoose = require("mongoose");
// importation du routeur
const sauceRoutes = require("./routes/Sauce");
// importation du routeur login
const userRoutes = require("./routes/user");
// importation de node qui donne accés au chemin du système de fichier
const path = require("path");
// Importation de mongo sanitize
const mongoSanitize = require("express-mongo-sanitize");
// Importation de xss clean
const xssClean = require("xss-clean");
// importation de helmet pour la sécurisation des entêtes
const helmet = require("helmet");

// Permet de se relier à la base de donnée MongoDB atlas
mongoose
  .connect(
    "mongodb+srv://Proprietaire:Piiquante@cluster0.vpdpa.mongodb.net/TestSauce?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//création d'une constante pour l'application
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

// applique les middleware d'helmet
app.use(helmet());
// Transforme les données arrivant des requêtes POST en objet JSON (body-parser intégré à express)
app.use(express.json());
// Middleware Express 4.x qui nettoie les données fournies par l’utilisateur pour empêcher l’injection de l’opérateur MongoDB
app.use(mongoSanitize());
// Connectez le middleware pour nettoyer les entrées utilisateur provenant du corps POST, des requêtes GET et des paramètres d’URL, Protection contre les attaques XSS
app.use(xssClean());

// route des images
app.use("/images", express.static(path.join(__dirname, "images")));
// mise en place du début de la route et pour cette route ont utilise le routeur sauceRoutes
app.use("/api/sauces", sauceRoutes);
// mise en place route pour l'authentification
app.use("/api/auth", userRoutes);

// on exporte l'application (notre constante app)
module.exports = app;
