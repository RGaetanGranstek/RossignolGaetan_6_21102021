// importation de multer
const multer = require("multer");

// dictionnaire
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// création d'un objet de configuration pour multer
const storage = multer.diskStorage({
  // function pour l'emplacement de sauvegarde des fichiers
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // explique à multer quel nom de fichier utilisé
  filename: (req, file, callback) => {
    // supprime les espaces avec "split" et les remplace avec "join"
    const name = file.originalname.split(" ").join("_");
    // création de l'extension du fichier
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
