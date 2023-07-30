const net = require("node:net");
const { Assistant } = require("./assistant.js");

class AssistantController {
  #socket;
  #assistant;

  constructor(assistant, socket) {
    this.#socket = socket;
    this.#assistant = assistant;
  }

  #generateGameEndingMessage(isWon, luckyNumber) {
    let message = `You Lost the lucky number is ${luckyNumber}`;
    if (isWon) message = "Correct Guess, You Won";

    return message;
  }

  #generateMessage(result) {
    let message = "small";
    if (!result.isBigger && !result.isLower) {
      return "Guess a number";
    }
    if (result.isBigger) message = "big";

    return `Server response: Number is too ${message}`;
  }

  #generateAndDisplayMessage(result, number) {
    const message = this.#generateMessage(result);
    console.log(message);
    console.log(`Assistant said: ${number}\n`);
  }

  #initialSetup(serverResponse) {
    const { description, upperLimit, lowerLimit } = serverResponse;

    this.#assistant.start(lowerLimit, upperLimit);

    console.log(description);

    const acknowledgement = {
      message: "setup-done",
      startGame: true,
      setupComplete: true,
    };

    this.#socket.write(JSON.stringify(acknowledgement));
  }

  #guess(state) {
    const { result } = state;

    const number = this.#assistant.suggestNumber(result);
    this.#generateAndDisplayMessage(result, number);

    const acknowledgement = { message: "validate-guess", guess: number };

    setTimeout(() => {
      this.#socket.write(JSON.stringify(acknowledgement));
    }, 1100);
  }

  #end(state) {
    const { isWon, isLost, luckyNumber } = state;

    if (isWon || isLost) {
      const message = this.#generateGameEndingMessage(isWon, luckyNumber);
      console.log(message);
    }
  }

  #onData(data) {
    const serverResponse = JSON.parse(data);
    const { message } = serverResponse;

    if (message === "initial-setup-info") {
      this.#initialSetup(serverResponse);
    }

    if (message === "game-started" || message === "guess-again") {
      this.#guess(serverResponse.state);
    }

    if (message === "game-over") {
      this.#end(serverResponse.state);
    }
  }

  start() {
    this.#socket.on("data", (data) => {
      this.#onData(data.trim());
    });
  }
}

const main = () => {
  const client = net.createConnection(8000);
  client.setEncoding("utf-8");

  client.on("connect", () => {
    const assistant = new Assistant(0, 10);
    const assistantController = new AssistantController(assistant, client);
    assistantController.start();
  });
};

main();
