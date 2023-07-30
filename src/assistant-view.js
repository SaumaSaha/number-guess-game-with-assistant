class AssistantView {
  #generateMessage(result) {
    let message = "small";

    if (result.isBigger) message = "big";

    return `Server response: Number is too ${message}`;
  }

  generateAndDisplayMessage(result, number) {
    const message = this.#generateMessage(result);

    console.log(message);
    console.log(`Assistant suggested: ${number}\n`);
  }

  displayGameEndingMessage(isWon, luckyNumber) {
    let message = `You Lost the lucky number is ${luckyNumber}`;
    if (isWon) message = "Correct Guess, You Won";

    console.log(message);
  }

  gameStartMessage(number) {
    console.log("Server Response: Guess a number");
    console.log(`Assistant suggested: ${number}\n`);
  }

  show(message) {
    console.log(message, "\n");
  }
}

module.exports = { AssistantView };
