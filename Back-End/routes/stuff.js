// création d'un routeur
const express = require("express");
const router = express.Router();
// importation du controllers
const stuffControllers = require("../controllers/stuff");

// logique de création d'objet
router.post("/", stuffControllers.createThing);

// modifier un objet existant dans la base de donnée
router.put("/:id", stuffControllers.modifyThing);

// supprimer un objet existant dans la base de donnée
router.delete("/:id", stuffControllers.deleteThing);

// :id <= parti de la route dynamique pour une recherche à l'unité dans la base de donnée
router.get("/:id", stuffControllers.getOneThing);

// pour trouver tous les objets
router.get("/", stuffControllers.getAllThings);

module.exports = router;
