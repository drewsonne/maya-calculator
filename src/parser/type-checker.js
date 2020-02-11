import linestart from "./tokens/line-start";
import lineend from "./tokens/line-end";
import commentstart from "./tokens/comment-start";
import Numeric from "./tokens/numeric";
import Operator from "./tokens/operator";


function is_processed_obj(part) {
  return is_calendar_round(part) || is_long_count(part);
}

function is_long_count(part) {
  return part.hasOwnProperty('parts');
}

function is_long_count_token(part) {
  return part.hasOwnProperty('long_count_obj');
}

function is_line_start(part) {
  return part === linestart;
}

function is_line_end(part) {
  return part === lineend;
}

function is_comment_start(part) {
  return part === commentstart;
}

function is_text(part) {
  return part instanceof Text;
}

function is_integer(part) {
  if (is_numeric(part)) {
    return /\d+/.test(part);
  }
  return false;
}

function is_numeric(part) {
  return part instanceof Numeric;
}

function is_operator(part) {
  return part instanceof Operator;
}

function is_calendar_round(part) {
  return part.hasOwnProperty('tzolkin') && part.hasOwnProperty('haab');
}

function is_plus_operator(part) {
  return is_operator_type(part, '+');
}

function is_minus_operator(part) {
  return is_operator_type(part, '-');
}

function is_operator_type(part, operator_type) {
  if (part.hasOwnProperty('raw_text')) {
    return operator_type === part.raw_text;
  }
  return false;
}

function is_full_date(part) {
  return part.hasOwnProperty('lc') && part.hasOwnProperty('lc');
}

export default {
  is_full_date,
  is_processed_obj,
  is_long_count,
  is_long_count_token,
  is_line_start,
  is_line_end,
  is_comment_start,
  is_text,
  is_numeric,
  is_operator,
  is_calendar_round,
  is_plus_operator,
  is_minus_operator,
  is_integer
};