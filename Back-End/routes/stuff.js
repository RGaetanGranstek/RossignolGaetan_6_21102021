// création d'un routeur
const express = require("express");
const router = express.Router();
// importation du controllers
const stuffControllers = require("../controllers/stuff");
// importation du auth (login)
const auth = require("../middleware/auth");

// logique de création d'objet + protection d'une route (auth)
router.post("/", auth, stuffControllers.createThing);

// modifier un objet existant dans la base de donnée
router.put("/:id", auth, stuffControllers.modifyThing);

// supprimer un objet existant dans la base de donnée
router.delete("/:id", auth, stuffControllers.deleteThing);

// :id <= parti de la route dynamique pour une recherche à l'unité dans la base de donnée
router.get("/:id", auth, stuffControllers.getOneThing);

// pour trouver tous les objets
router.get("/", auth, stuffControllers.getAllThings);

module.exports = router;
