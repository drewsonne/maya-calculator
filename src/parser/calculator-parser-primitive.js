import mayadates from '@drewsonne/maya-dates';

import log from 'loglevel';
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
    log.debug('[PrimitiveCalculatorParser] start parsing.');
    const result = lines.map((line) => {
      log.debug(`[PrimitiveCalculatorParser] found line: '${line}'`);
      const tokens = new Array(linestart);
      if (line.trim() !== '') {
        const parts = line.trim().split(' ');
        for (let i = 0; i < parts.length; i += 1) {
          const part = parts[i];
          log.trace(`[PrimitiveCalculatorParser] found line part: '${part}'`);
          if (that.isWildcard(part)) {
            log.trace('[PrimitiveCalculatorParser] part is wildcard');
            tokens.push(wildcard);
          } else if (that.hasOperator(part)) {
            log.trace('[PrimitiveCalculatorParser] part is operator');
            tokens.push(new Operator(part[0]));
            if (part.length > 1) {
              parts[i] = part.slice(1, part.length);
              i -= 1;
            }
          } else if (that.isComment(part)) {
            log.trace('[PrimitiveCalculatorParser] part is comment');
            tokens.push(commentstart);
            if (part.length > 1) {
              tokens.push(
                new Text(part.slice(1, part.length))
              );
            }
          } else if (that.isLongCount(part)) {
            log.trace('[PrimitiveCalculatorParser] part is long-count');
            tokens.push(
              new mayadates.factory.LongCountFactory().parse(part)
            );
          } else if (that.isNumeric(part)) {
            log.trace('[PrimitiveCalculatorParser] part is numeric');
            tokens.push(new Numeric(part));
          } else if (that.isWord(part)) {
            log.trace('[PrimitiveCalculatorParser] part is word');
            tokens.push(new Text(part));
          } else {
            log.error('[PrimitiveCalculatorParser] could not determine type');
            throw new Error(`Unexpected token found (${part}) in line (${line})`);
          }
        }
      }
      tokens.push(lineend);
      return tokens;
    }).flatMap((t) => t);
    log.debug('[PrimitiveCalculatorParser] finish parsing.');
    return result;
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
