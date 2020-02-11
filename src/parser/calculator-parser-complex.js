import Line from './complex-tokens/line';
import Comment from './complex-tokens/comment';
import CalendarRoundWindowing from './calendar-round-windowing';
import FullDateWindowing from './full-date-windowing';
import OperatorWindowing from './operator-windowing';
import mayadate from '@drewsonne/maya-dates';
import PrimitiveCalculatorParser from "./calculator-parser-primitive";
import LongCountToken from './complex-tokens/long-count';
import TypeChecker from './type-checker';


const WAITING_TO_START = 0;
const PARSING_LINE = 1;
const FOUND_NUMERIC = 2;
const PARSING_COMMENT = 3;

class _State {

  constructor(state) {
    this.state = state;
  }

  set(new_state) {
    this.state = new_state;
  }

  is(new_state) {
    return this.state === new_state;
  }
}

class ComplexCalculatorParser {

  run(raw_text) {
    let lcFactory = new mayadate.factory.LongCountFactory();
    // let crFactory = new mayadate.factory.CalendarRoundFactory();
    let primitiveParts = new PrimitiveCalculatorParser(raw_text).run();
    debugger

    let fullDateParsed = new FullDateWindowing(primitiveParts).run();
    while (fullDateParsed !== null) {
      let index = fullDateParsed[0];
      let fullDate = fullDateParsed[1];
      let length = fullDateParsed[2];
      let prefix = primitiveParts.slice(0, index);
      let suffix = primitiveParts.slice(index + length);
      primitiveParts = prefix.concat([fullDate]).concat(suffix);
      fullDateParsed = new FullDateWindowing(primitiveParts).run();
    }

    let crParsed = new CalendarRoundWindowing(primitiveParts).run();
    while (crParsed !== null) {
      let index = crParsed[0];
      let cr = crParsed[1];
      let length = crParsed[2];
      let prefix = primitiveParts.slice(0, index);
      let suffix = primitiveParts.slice(index + length);
      primitiveParts = prefix.concat([cr]).concat(suffix);
      crParsed = new CalendarRoundWindowing(primitiveParts).run();
    }

    let state = new _State(WAITING_TO_START);
    let current = [];
    let cache = [];
    let elements = [];
    for (let i = 0; i < primitiveParts.length; i++) {
      let part = primitiveParts[i];
      if (state.is(PARSING_COMMENT)) {
        if (TypeChecker.is_line_end(part)) {
          current.push(new Comment(`${cache.join(' ')}`));
          elements.push(current);
          state.set(WAITING_TO_START);
          cache = [];
          current = null;
        } else {
          cache.push(part);
        }
      } else if (state.is(WAITING_TO_START)) {
        if (TypeChecker.is_line_start(part)) {
          current = new Line();
          state.set(PARSING_LINE);
        } else {
          throw new Error(`State WAITING_TO_START and element ${part} is unexpected`);
        }
      } else if (state.is(PARSING_LINE)) {
        if (TypeChecker.is_numeric(part)) {
          let lcResult = lcFactory.parse(
            TypeChecker.is_integer(part) ? `0.0.${part}` : `${part}`
          );
          current.push(new LongCountToken(lcResult));
        } else if (TypeChecker.is_comment_start(part)) {
          cache = [];
          state.set(PARSING_COMMENT);
        } else if (TypeChecker.is_operator(part)) {
          current.push(part);
        } else if (TypeChecker.is_line_end(part)) {
          elements.push(
            current
          );
          state.set(WAITING_TO_START);
        } else if (TypeChecker.is_calendar_round(part)) {
          current.push(part);
        } else if (TypeChecker.is_processed_obj(part)) {
          current.push(part);
        } else {
          throw new Error(`State PARSING_LINE and element ${part} is unexpected`);
        }
      } else if (state.is(FOUND_NUMERIC)) {
        if (TypeChecker.is_text(part)) {
          throw new Error(`State FOUND_NUMERIC and element is_text(${part}) is unexpected`);
        } else {
          throw new Error(`State FOUND_NUMERIC and element ${part} is unexpected`);
        }
      } else {
        throw new Error(`State ${state.state} and element ${part} is unexpected`);
      }
    }

    let operatorParsed = new OperatorWindowing(elements).run();
    while (operatorParsed !== null) {
      let index = operatorParsed[0];
      let cr = operatorParsed[1];
      let length = operatorParsed[2];
      let prefix = elements.slice(0, index);
      let suffix = elements.slice(index + length);
      elements = prefix.concat([cr]).concat(suffix);
      operatorParsed = new CalendarRoundWindowing(elements).run();
    }

    return elements;
  }
}

export default ComplexCalculatorParser;