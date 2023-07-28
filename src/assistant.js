const net = require("node:net");

class Assistant {
  #upperLimit;
  #lowerLimit;
  #currentNumber;

  constructor(lowerLimit, upperLimit) {
    this.#upperLimit = upperLimit;
    this.#lowerLimit = lowerLimit;
    this.#currentNumber = 0;
  }

  #generateRandomNumber() {
    this.#currentNumber =
      this.#lowerLimit +
      Math.floor(Math.random() * (this.#upperLimit - this.#lowerLimit));

    return this.#currentNumber;
  }

  suggestNumber(result) {
    if (result.isLower) {
      this.#lowerLimit = this.#currentNumber + 1;
    }

    if (result.isBigger) {
      this.#upperLimit = this.#currentNumber - 1;
    }

    return this.#generateRandomNumber();
  }
}

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

  #onData(data) {
    const { result, isWon, isLost, luckyNumber } = JSON.parse(data);

    if (isWon || isLost) {
      const message = this.#generateGameEndingMessage(isWon, luckyNumber);
      console.log(message);
      return;
    }

    const number = this.#assistant.suggestNumber(result);
    this.#generateAndDisplayMessage(result, number);

    setTimeout(() => {
      this.#socket.write(`${number}`);
    }, 1100);
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
