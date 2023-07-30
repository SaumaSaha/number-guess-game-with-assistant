class Assistant {
  #upperLimit;
  #lowerLimit;
  #currentNumber;

  constructor() {
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

  start(lowerLimit, upperLimit) {
    this.#lowerLimit = lowerLimit;
    this.#upperLimit = upperLimit;
  }
}

module.exports = { Assistant };
