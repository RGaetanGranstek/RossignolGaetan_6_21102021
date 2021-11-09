// model user
const User = require("../models/User");
// package cryptage des mots de passe (hashage)
const bcrypt = require("bcrypt");
// création de token et permet aussi de les vérifier
const jwt = require("jsonwebtoken");
// maskdata est un module Node.js pour masquer différents types de données. Avec l’aide de maskdata, vous pouvez masquer l’e-mail, le numéro de téléphone, le numéro de carte, les champs JSON, le mot de passe, etc.
const MaskData = require("maskdata");
// mise en place d'un validateur de mot de passe + complexe
const passwordValidator = require("password-validator");

// Création d'un schema pour le mot de passe
const schema = new passwordValidator();
schema
  .is()
  .min(10) // longueur minimum 10
  .is()
  .max(100) // longueur maximum 100
  .has()
  .uppercase(1) // 1 majuscule minimum
  .has()
  .lowercase(1) // 1 minuscule minimum
  .has()
  .digits(2) // 2 chiffres minimum
  .has()
  .symbols(1) // 1 symbole minimum
  .has()
  .not()
  .spaces() // aucun espace
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist certain mdp défini

// utilisation des options de maskdata pour cacher l'email
const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 2,
  maskAtTheRate: false,
};

// middleware signup pour l'enregistrement des new utilisateur en cryptant le mot de passe
exports.signup = (req, res, next) => {
  // hash (fonction asynchrome qui prend du temps) pour crypter
  // salt = 10, tour pour l'algorithme de hashage, suffisant pour un mot de passe
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // création d'un nouvel utilisateur avec le mot de passe crypté et email
      const user = new User({
        email: MaskData.maskEmail2(req.body.email, emailMask2Options),
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
  User.findOne({
    email: MaskData.maskEmail2(req.body.email, emailMask2Options),
  })
    .then((user) => {
      // si ont ne trouve pas de correspondance ont renvoi une erreur
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      if (!schema.validate(req.body.password)) {
        //Renvoie une erreur si le schema de mot de passe n'est pas respecté
        return res.status(400).json({
          message:
            "Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, 2 chiffres, un symbole ainsi qu'aucun espace.",
        });
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
              // argument de configuration (expiration 24H)
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
