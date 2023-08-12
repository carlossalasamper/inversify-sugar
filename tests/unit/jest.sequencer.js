const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    return Array.from(tests).sort((testA, testB) => {
      const scoreA = this.getScore(testA);
      const scoreB = this.getScore(testB);

      return scoreA > scoreB ? 1 : -1;
    });
  }

  getScore(test) {
    const score = 0;

    if (test.path.match("tests/unit/decorators")) {
      score = 1;
    } else if (test.path.match("tests/unit/utils")) {
      score = 2;
    }
  }
}

module.exports = CustomSequencer;
