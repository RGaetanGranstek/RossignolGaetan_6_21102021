// création d'un routeur
const express = require("express");
const router = express.Router();
// importation du controllers
const sauceControllers = require("../controllers/Sauce");
// importation du auth (login)
const auth = require("../middleware/auth");
// importation de multer
const multer = require("../middleware/multer-config");

// logique de création d'objet + protection d'une route (auth)
// multer aprés auth pour assurer l'authentification avant toute modification de l'image
router.post("/", auth, multer, sauceControllers.createSauce);

// modifier un objet existant dans la base de donnée
router.put("/:id", auth, multer, sauceControllers.modifySauce);

// supprimer un objet existant dans la base de donnée
router.delete("/:id", auth, sauceControllers.deleteSauce);

// :id <= parti de la route dynamique pour une recherche à l'unité dans la base de donnée
router.get("/:id", auth, sauceControllers.getOneSauce);

// pour trouver tous les objets
router.get("/", auth, sauceControllers.getAllSauces);

module.exports = router;
