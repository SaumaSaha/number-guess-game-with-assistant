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

module.exports = { GuessGame };
