const net = require("node:net");

class GuessGame {
  #luckyNumber;
  #chancesLeft;
  #gameWon;
  #gameLost;
  #result;

  constructor(number, chancesLeft) {
    this.#luckyNumber = number;
    this.#chancesLeft = chancesLeft;
    this.#chancesLeft = chancesLeft;
    this.#result = { isHigher: false, isLower: false };
    this.#gameWon = false;
    this.#gameLost = false;
  }

  #reduceChances() {
    this.#chancesLeft--;
  }

  #validateGuess(guess) {
    if (guess === this.#luckyNumber) {
      this.#gameWon = true;
      return;
    }
    if (this.#chancesLeft === 0) this.#gameLost = true;
  }

  #isHigherOrLower(guess) {
    if (guess > this.#luckyNumber) {
      this.#result.isHigher = true;
      this.#result.isLower = false;
    }

    if (guess < this.#luckyNumber) {
      this.#result.isHigher = false;
      this.#result.isLower = true;
    }
  }

  play(guess) {
    this.#reduceChances();
    this.#validateGuess(guess);
    this.#isHigherOrLower(guess);
  }

  state() {
    return {
      result: this.#result,
      isWon: this.#gameWon,
      isLost: this.#gameLost,
      luckyNumber: this.#gameLost ? this.#luckyNumber : null,
    };
  }
}

class GameController {
  #game;
  #socket;

  constructor(game, socket) {
    this.#game = game;
    this.#socket = socket;
  }

  #isValidInput(input) {
    return !/[^0-9]+/.test(input);
  }

  #onGuess(guess) {
    this.#game.play(guess);
    const state = this.#game.state();

    this.#socket.write(JSON.stringify({ ...state }));
    if (state.isWon || state.isLost) this.#socket.end();
  }

  start() {
    this.#socket.write(JSON.stringify(this.#game.state()));
    this.#socket.on("data", (data) => {
      if (this.#isValidInput(data.trim())) this.#onGuess(+data.trim());
    });
  }
}

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
