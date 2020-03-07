import mayadates from '@drewsonne/maya-dates';

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
    const that = this;
    return lines.map((line) => {
      const tokens = new Array(linestart);
      if (line.trim() !== '') {
        const parts = line.trim().split(' ');
        for (let i = 0; i < parts.length; i += 1) {
          const part = parts[i];
          if (that.isWildcard(part)) {
            tokens.push(wildcard);
          } else if (that.hasOperator(part)) {
            tokens.push(new Operator(part[0]));
            if (part.length > 1) {
              parts[i] = part.slice(1, part.length);
              i -= 1;
            }
          } else if (that.isComment(part)) {
            tokens.push(commentstart);
            if (part.length > 1) {
              tokens.push(
                new Text(part.slice(1, part.length))
              );
            }
          } else if (that.isLongCount(part)) {
            tokens.push(
              new mayadates.factory.LongCountFactory().parse(part)
            );
          } else if (that.isNumeric(part)) {
            tokens.push(new Numeric(part));
          } else if (that.isWord(part)) {
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

  isWildcard(part) {
    return part === '*';
  }

  isComment(part) {
    return part[0] === '#';
  }

  isNumeric(part) {
    return /^[\d*.]+$/.test(part);
  }

  isLongCount(part) {
    return this.isNumeric(part) && part.includes('.');
  }

  isWord(part) {
    return /^[*()\w\d.']+$/.test(part);
  }

  hasOperator(part) {
    return ['+', '-'].includes(part[0]);
  }
}
