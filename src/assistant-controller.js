class AssistantController {
  #socket;
  #assistant;
  #view;

  constructor(assistant, socket, view) {
    this.#socket = socket;
    this.#assistant = assistant;
    this.#view = view;
  }

  #initialSetup(serverResponse) {
    const { description, upperLimit, lowerLimit } = serverResponse;

    this.#assistant.start(lowerLimit, upperLimit);

    const acknowledgement = {
      message: "setup-done",
      startGame: true,
      setupComplete: true,
    };

    this.#view.show(description);
    this.#socket.write(JSON.stringify(acknowledgement));
  }

  #guess(serverResponse) {
    const { message, state } = serverResponse;
    const { result } = state;

    const number = this.#assistant.suggestNumber(result);

    const acknowledgement = { message: "validate-guess", guess: number };

    if (message === "game-started") {
      this.#view.gameStartMessage(number);
    } else {
      this.#view.generateAndDisplayMessage(result, number);
    }

    setTimeout(() => {
      this.#socket.write(JSON.stringify(acknowledgement));
    }, 1100);
  }

  #end(state) {
    const { isWon, isLost, luckyNumber } = state;

    if (isWon || isLost) {
      this.#view.displayGameEndingMessage(isWon, luckyNumber);
    }
  }

  #onData(data) {
    const serverResponse = JSON.parse(data);
    const { message } = serverResponse;

    switch (message) {
      case "initial-setup-info":
        this.#initialSetup(serverResponse);
        break;
      case "game-over":
        this.#end(serverResponse.state);
        break;
      default:
        this.#guess(serverResponse);
        break;
    }
  }

  start() {
    this.#socket.on("data", (data) => {
      this.#onData(data.trim());
    });
  }
}
