const net = require("node:net");
const { GuessGame } = require("./game.js");
const { GameController } = require("./game-controller.js");

const generateRandomNumber = (upperLimit) =>
  Math.floor(Math.random() * upperLimit);

const main = () => {
  const server = net.createServer();

  server.listen(8000, () => {
    console.log("Game server started listening...");
  });

  server.on("connection", (socket) => {
    socket.setEncoding("utf-8");
    const game = new GuessGame(generateRandomNumber(10), 5);
    const gameController = new GameController(game, socket);
    gameController.start();
  });
};

main();
