const http = require("http");
const app = require("./app");

//ont dit à l'application sur quel port elle doit fonctionner
app.set("port", process.env.PORT || 3000);

//  Cette fonction reçoit les objets request et response en tant qu'arguments
const server = http.createServer(
  // (req, res) => {
  // // la méthode end de la réponse renvoye une réponse de type string à l'appelant
  // res.end("Cool, le serveur fonctionne !");}
  app
);

// process.env.PORT => variable environnement (Là ou tourne le serveur si il envoi un port à utiliser sinon par défaut port 3000)
server.listen(process.env.PORT || 3000);

// *********
// *********
// *********
// *********
// *********

// const normalizePort = (val) => {
//   const port = parseInt(val, 10);

//   if (isNaN(port)) {
//     return val;
//   }
//   if (port >= 0) {
//     return port;
//   }
//   return false;
// };

// const errorHandler = (error) => {
//   if (error.syscall !== "listen") {
//     throw error;
//   }
//   const address = server.address();
//   const bind =
//     typeof address === "string" ? "pipe " + address : "port: " + port;
//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " requires elevated privileges.");
//       process.exit(1);
//     case "EADDRINUSE":
//       console.error(bind + " is already in use.");
//       process.exit(1);
//     default:
//       throw error;
//   }
// };

// const server = http.createServer(app);

// server.on("error", errorHandler);
// server.on("listening", () => {
//   const address = server.address();
//   const bind = typeof address === "string" ? "pipe " + address : "port " + port;
//   console.log("Listening on " + bind);
// });

// server.listen(port);
