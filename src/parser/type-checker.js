import linestart from './tokens/line-start';
import lineend from './tokens/line-end';
import commentstart from './tokens/comment-start';
import Numeric from './tokens/numeric';
import Operator from './tokens/operator';
import wildcard from './tokens/wildcard';
import Text from './tokens/text';

function isLongCount(part) {
  // eslint-disable-next-line no-prototype-builtins
  return part.hasOwnProperty('parts');
}

function isLongCountToken(part) {
  // eslint-disable-next-line no-prototype-builtins
  return part.hasOwnProperty('long_count_obj');
}

function isLineStart(part) {
  return part === linestart;
}

function isLineEnd(part) {
  return part === lineend;
}

function isCommentStart(part) {
  return part === commentstart;
}

function isComment(part) {
  // eslint-disable-next-line no-prototype-builtins
  return part.hasOwnProperty('commentText');
}

function isText(part) {
  return part instanceof Text;
}

function isNumeric(part) {
  return part instanceof Numeric;
}

function isInteger(part) {
  if (isNumeric(part)) {
    return /^\d+$/.test(part);
  }
  return false;
}

function isOperator(part) {
  return part instanceof Operator;
}

function isCalendarRound(part) {
  // eslint-disable-next-line no-prototype-builtins
  return part.hasOwnProperty('tzolkin') && part.hasOwnProperty('haab');
}

function isOperatorType(part, operatorType) {
  // eslint-disable-next-line no-prototype-builtins
  if (part.hasOwnProperty('raw_text')) {
    return operatorType === part.raw_text;
  }
  return false;
}

function isPlusOperator(part) {
  return isOperatorType(part, '+');
}

function isMinusOperator(part) {
  return isOperatorType(part, '-');
}

function isFullDate(part) {
  // eslint-disable-next-line no-prototype-builtins
  return part.hasOwnProperty('lc') && part.hasOwnProperty('lc');
}

function isLine(part) {
  // eslint-disable-next-line no-prototype-builtins
  return part.hasOwnProperty('line_parts');
}

function isProcessedObj(part) {
  return isCalendarRound(part) || isLongCount(part);
}

function isWildcard(part) {
  return wildcard === part;
}

export default {
  isFullDate,
  isProcessedObj,
  isLongCount,
  isLongCountToken,
  isLineStart,
  isLineEnd,
  isCommentStart,
  isText,
  isNumeric,
  isOperator,
  isCalendarRound,
  isPlusOperator,
  isMinusOperator,
  isInteger,
  isLine,
  isComment,
  isWildcard
};
