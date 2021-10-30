// const http = require("http");
// const app = require("./app");

// //ont dit à l'application sur quel port elle doit fonctionner
// app.set("port", process.env.PORT || 3000);

// //  Cette fonction reçoit les objets request et response en tant qu'arguments
// const server = http.createServer(
//   // (req, res) => {
//   // // la méthode end de la réponse renvoye une réponse de type string à l'appelant
//   // res.end("Cool, le serveur fonctionne !");}
//   app
// );

// // process.env.PORT => variable environnement (Là ou tourne le serveur si il envoi un port à utiliser sinon par défaut port 3000)
// server.listen(process.env.PORT || 3000);

// *********
// *********
// *********
// *********
// *********

const http = require("http");
const app = require("./app");

//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.listen(port);
