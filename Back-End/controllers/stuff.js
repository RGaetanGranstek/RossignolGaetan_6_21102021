// importation du modele
const Thing = require("../models/Thing");

// Ici la logique pour chaque fonction

// Pour la création d'objet
exports.createThing = (req, res, next) => {
  // ont enléve l'id car mongoDB en génére un de lui même
  delete req.body._id;
  const thing = new Thing({
    // permet de récupérer tous les champs du corp de la requête
    ...req.body,
  });
  // save dans la base de donnée MongoDB
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// modifier un objet existant dans la base de donnée
exports.modifyThing = (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// supprimer un objet existant dans la base de donnée
exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

// :id <= parti de la route dynamique pour une recherche à l'unité dans la base de donnée
exports.getOneThing = (req, res, next) => {
  // findOne pour trouver qu'un seul objet
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
  // find pour trouver tous les objets
  Thing.find()
    // récupération du tableau de tous les things, et ont renvoi le tableau reçu par le Back-End (base de donnée)
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};
