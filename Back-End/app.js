// importation d'express
const express = require("express");

//création d'une constante pour l'application qui dans l'immédiat ne contiendra rien(ont appelle juste express pour créé une application express)
const app = express();

// middleware, fonction dans l'application qui recoit requête et réponse qui les géres et passe avec next à un prochain middleware
app.use((req, res, next) => {
  console.log("Requête reçue !");
  next();
});

// middleware 2
app.use((req, res, next) => {
  // modification du code de la réponse Http
  res.status(201);
  next();
});

// middleware 3
app.use((req, res, next) => {
  res.json({ message: "Cool, le serveur fonctionne !" });
  next();
});

// middleware 4
app.use((req, res) => {
  console.log("Réponse envoyée avec succés !");
});

// on exporte l'application (notre constante app)
module.exports = app;
