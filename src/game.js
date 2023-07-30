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
    this.#result = { isBigger: false, isSmaller: false };
    this.#gameWon = false;
    this.#gameLost = false;
  }

  #reduceChances() {
    this.#chancesLeft--;
  }

  #isGameOver(guess) {
    if (guess === this.#luckyNumber) {
      this.#gameWon = true;
      return;
    }
    if (this.#chancesLeft === 0) this.#gameLost = true;
  }

  #isBiggerOrLower(guess) {
    if (guess > this.#luckyNumber) {
      this.#result.isBigger = true;
      this.#result.isSmaller = false;
    }

    if (guess < this.#luckyNumber) {
      this.#result.isBigger = false;
      this.#result.isSmaller = true;
    }
  }

  validate(guess) {
    this.#reduceChances();
    this.#isGameOver(guess);
    this.#isBiggerOrLower(guess);
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

  #onGuess(guess) {
    this.#game.validate(guess);
    const state = this.#game.state();
    const response = { message: "guess-again", state };

    if (state.isWon || state.isLost) {
      response.message = "game-over";
      this.#socket.write(JSON.stringify(response));
      this.#socket.end();
      return;
    }

    this.#socket.write(JSON.stringify(response));
  }

  #startGame() {
    const response = {
      message: "game-started",
      state: this.#game.state(),
    };

    this.#socket.write(JSON.stringify(response));
  }

  start() {
    const initialResponse = {
      message: "initial-setup-info",
      description:
        "This is a number guess game you have to guess a number between 0 to 10",
      lowerLimit: 0,
      upperLimit: 10,
    };
    this.#socket.write(JSON.stringify(initialResponse));

    this.#socket.on("data", (data) => {
      const acknowledgement = JSON.parse(data);
      const { message } = acknowledgement;

      switch (message) {
        case "setup-done":
          this.#startGame();
          break;
        case "validate-guess":
          this.#onGuess(acknowledgement.guess);
          break;
      }
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
