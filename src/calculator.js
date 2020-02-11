export default class Calculator {
  constructor(lines) {
    this.lines = lines;
    this.register = [];
  }

  run() {
    for (let line of this.lines) {
      for (let token of line) {
        this.register = token.process(this.register);
      }
    }
    return this.register;
  }

}