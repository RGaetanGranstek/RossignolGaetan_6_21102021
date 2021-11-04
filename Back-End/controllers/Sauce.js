// importation du modele
const Sauce = require("../models/Sauce");
// importation de fs de node pour file system pour avoir accés aux différentes opérations du système de fichier
const fs = require("fs");

// Ici la logique pour chaque fonction

// Pour la création d'objet
exports.createSauce = (req, res, next) => {
  // chaine de caractére sous forme javascript req.body.sauce
  const sauceObject = JSON.parse(req.body.sauce);
  // ont enléve l'id car mongoDB en génére un de lui même
  delete sauceObject._id;
  const sauce = new Sauce({
    // permet de récupérer tous les champs du corp de la requête
    ...sauceObject,
    // ont génére une URL de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // save dans la base de donnée MongoDB
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// modifier un objet existant dans la base de donnée
exports.modifySauce = (req, res, next) => {
  // permet de savoir si image existante ou si nouvelle
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        // ont génére une URL de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // si il n'existe pas on fait une copie de req.body
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// supprimer un objet existant dans la base de donnée
exports.deleteSauce = (req, res, next) => {
  //ont trouve l'objet dans la base de donnée
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // ont récupère le nom du fichier à supprimer
      const filename = sauce.imageUrl.split("/images/")[1];
      // ont supprime l'objet
      fs.unlink(`images/${filename}`, () => {
        // ont renvoi une réponse si fonctionne ou non
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// :id <= parti de la route dynamique pour une recherche à l'unité dans la base de donnée
exports.getOneSauce = (req, res, next) => {
  // findOne pour trouver qu'un seul objet
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  // find pour trouver tous les objets
  Sauce.find()
    // récupération du tableau de tous les sauces, et ont renvoi le tableau reçu par le Back-End (base de donnée)
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Incrémentation des likes et dislikes utilisateur pour les sauces
exports.likeDislikeSauce = (req, res, next) => {
  if (req.body.like === undefined || req.body.userId === undefined) {
    return res.status(400).json({ message: "Bad request !" });
  }
  const id = req.params.id;
  const like = req.body.like;
  const userId = req.body.userId;
  const unLike = Sauce.updateOne(
    { _id: id },
    // Décrémentation d'un like et d'un utilisateur
    { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
  )
    .then(() => {
      res.status(201).json({
        message: `Le vote pour la sauce ${Sauce.name} n'est plus pris en compte`,
      });
    })
    .catch((error) => res.status(500).json({ error }));
  switch (like) {
    case 0:
      Sauce.findOne({ _id: id })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            unLike;
          }
        })
        .then((sauce) => {
          if (sauce.usersDisliked.includes(userId)) {
            unLike;
          }
        })
        .catch((error) => res.status(500).json({ error }));
      break;
    // L'utilisateur aime la sauce
    case 1:
      Sauce.updateOne(
        { _id: id },
        // Incrémentation d'un like et d'un utilisateur
        { $inc: { likes: 1 }, $push: { usersLiked: userId } }
      )
        .then(() =>
          res.status(201).json({ message: `Vous aimez ${Sauce.name}` })
        )
        .catch((error) => res.status(500).json({ error }));
      break;
    // L'utilisateur n'aime pas la sauce
    case -1:
      Sauce.updateOne(
        { _id: id },
        // Incrémentation d'un like et d'un utilisateur
        { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } }
      )
        .then(() =>
          res.status(201).json({ message: `Vous n'aimez pas ${Sauce.name}` })
        )
        .catch((error) => res.status(500).json({ error }));
      break;
    default:
      return res.status(400).json({ message: "Bad request" });
  }
};
