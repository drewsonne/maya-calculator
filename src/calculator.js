export default class Calculator {
  constructor(lines) {
    this.lines = lines;
  }

  run() {
    return this.lines.reduce((register, line) => (
      (line.length === 0)
        ? line.process(register)
        : line.reduce((tokenRegister, token) => token.process(tokenRegister), register)
    ), []);
  }
}
