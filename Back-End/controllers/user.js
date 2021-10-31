// model user
const User = require("../models/User");
// package cryptage des mots de passe
const bcrypt = require("bcrypt");
// créationd de token et permet aussi de les vérifier
const jwt = require("jsonwebtoken");

// middleware signup pour l'enregistrement des new utilisateur en cryptant le mot de passe
exports.signup = (req, res, next) => {
  // hash (fonction asynchrome qui prend du temps) pour crypter
  // salt = 10, tour pour l'algorithme de hashage, suffisant pour un mot de passe
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // création d'un nouvel utilisateur avec le mot de passe crypté et email
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //enregistrement de l'utilisateur dans la base de donnée
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//fonction login pour connecter les utilisateurs existants
exports.login = (req, res, next) => {
  // ont récupère l'utilisateur dans la base de donnée qui correspond à l'adresse email entrée par l'utilisateur
  User.findOne({ email: req.body.email })
    .then((user) => {
      // si ont ne trouve pas de correspondance ont renvoi une erreure
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // ont compare le mot de passe entré avec le hash enregistré dans la base de donnée
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // si la comparaison n'est pas bonne on renvoi une erreur
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // si l'identification est bonne on renvoi le user._id attendu par le front-end et un token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              // donnée que l'ont veux encodé à l'intérieur du token
              { userId: user._id },
              // clé secrete pour l'encodage
              "RANDOM_TOKEN_SECRET",
              // argumlent de configuration (expiration 24H)
              { expiresIn: "24h" }
            ),
          });
        })
        .catch();
    })
    .catch((error) => res.status(500).json({ error }));
};
