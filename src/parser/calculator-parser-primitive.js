import linestart from './tokens/line-start';
import lineend from './tokens/line-end';
import commentstart from './tokens/comment-start';
import Text from './tokens/text';
import Numeric from './tokens/numeric';
import Operator from './tokens/operator';
import wildcard from './tokens/wildcard';

const concat = (x, y) => x.concat(y);

// eslint-disable-next-line no-extend-native,func-names
Array.prototype.flatMap = function (f) {
  return this.map(f).reduce(concat, []);
};

export default class PrimitiveCalculatorParser {
  constructor(rawText) {
    this.rawText = rawText;
  }

  run() {
    const lines = this.rawText.split(/\n/);
    return lines.map((line) => {
      const tokens = new Array(linestart);
      if (line.trim() !== '') {
        const parts = line.trim().split(' ');
        for (let i = 0; i < parts.length; i += 1) {
          const part = parts[i];
          if (part === '*') {
            tokens.push(wildcard);
          } else if (['+', '-'].includes(part[0])) {
            tokens.push(new Operator(part[0]));
            if (part.length > 1) {
              parts[i] = part.slice(1, part.length);
              i -= 1;
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
      return tokens;
    }).flatMap((t) => t);
  }
}
