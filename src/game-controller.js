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

module.exports = { GameController };
