import linestart from './tokens/line-start';
import lineend from './tokens/line-end';
import commentstart from './tokens/comment-start';
import Text from './tokens/text';
import Numeric from './tokens/numeric';
import Operator from './tokens/operator';
import Wildcard from './tokens/wildcard';

class PrimitiveCalculatorParser {
  constructor(raw_text) {
    this.raw_text = raw_text;
  }

  run() {
    let lines = this.raw_text.split(/\n/);
    let tokens = [];
    for (let line of lines) {
      tokens.push(linestart);
      if (line.trim() !== "") {
        let parts = line.trim().split(' ');
        for (let i = 0; i < parts.length; i++) {
          let part = parts[i];
          if (part === '*') {
            tokens.push(new Wildcard(part[0]));
          } else if (['+', '-'].includes(part[0])) {
            tokens.push(new Operator(part[0]));
            if (part.length > 1) {
              parts[i] = part.slice(1, part.length);
              i--;
              continue;
            }
          } else if (part[0] === '#') {
            tokens.push(commentstart);
            if (part.length > 1) {
              tokens.push(
                new Text(part.slice(1, part.length))
              );
            }
          } else if (/^[\d*.]+$/.test(part)) {
            tokens.push(new Numeric(part));
          } else if (/^[*()\w\d.']+$/.test(part)) {
            tokens.push(new Text(part));
          } else {
            throw new Error(`Unexpected token found (${part}) in line (${line})`);
          }
        }
      }
      tokens.push(lineend);
    }
    return tokens;
  }
}

export default PrimitiveCalculatorParser;