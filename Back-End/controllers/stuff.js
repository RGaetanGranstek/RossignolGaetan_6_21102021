// importation du modele
const Thing = require("../models/Thing");
// importation de fs de node pour file system pour avoir accés aux différentes opérations du système de fichier
const fs = require("fs");

// Ici la logique pour chaque fonction

// Pour la création d'objet
exports.createThing = (req, res, next) => {
  // chaine de caractére sous forme javascript req.body.thing
  const thingObject = JSON.parse(req.body.thing);
  // ont enléve l'id car mongoDB en génére un de lui même
  delete thingObject._id;
  const thing = new Thing({
    // permet de récupérer tous les champs du corp de la requête
    ...thingObject,
    // ont génére une URL de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // save dans la base de donnée MongoDB
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// modifier un objet existant dans la base de donnée
exports.modifyThing = (req, res, next) => {
  // permet de savoir si image existante ou si nouvelle
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        // ont génére une URL de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // si il n'existe pas on fait une copie de req.body
  Thing.updateOne(
    { _id: req.params.id },
    { ...thingObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// supprimer un objet existant dans la base de donnée
exports.deleteThing = (req, res, next) => {
  //ont trouve l'objet dans la base de donnée
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      // ont récupère le nom du fichier à supprimer
      const filename = thing.imageUrl.split("/images/")[1];
      // ont supprime l'objet
      fs.unlink(`images/${filename}`, () => {
        // ont renvoi une réponse si fonctionne ou non
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
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
