export default class Calculator {
  constructor(lines) {
    this.lines = lines;
  }

  run() {
    return this.lines.reduce((register, line) => {
      if (line.length === 0) {
        return line.process(register);
      } else {
        return line.reduce(
          (tokenRegister, token) => token.process(tokenRegister), register
        );
      }
    }, []);
  }
}
