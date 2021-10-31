// création du routeur des login
const express = require("express");
const router = express.Router();
// controlleur pour associer les fonctions aux différentes routes
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
