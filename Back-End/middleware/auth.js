// importation package jsonwebtoken pour vérifer les tokens
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // récupérer le token dans le header authorization
    // [1] => ont récupère le 2éme élement du tableau en cas d'erreur ça renvoi vers le catch
    const token = req.headers.authorization.spli(" ")[1];
    // ont décode le token avec la clé secréte en cas d'erreur ça renvoi vers le catch
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // ont récupére le userId récupérer dans le token et ont le compare avec celui dans la requéte
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      // si le userID est faux ont envoi une erreur
      throw "User ID non valable !";
    } else {
      // si c'est bon on passe la requéte au prochain middleware
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée !" });
  }
};
