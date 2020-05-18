import Line from "./parser/complex-tokens/line";

export default class Calculator {
  lines: Line[];

  constructor(lines: Line[]) {
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
