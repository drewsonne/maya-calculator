import mayadate from '@drewsonne/maya-dates';
import log from 'loglevel';
import Line from './complex-tokens/line';
import Comment from './complex-tokens/comment';
import CalendarRoundWindowing from './calendar-round-windowing';
import FullDateWindowing from './full-date-windowing';
import OperatorWindowing from './operator-windowing';
import PrimitiveCalculatorParser from './calculator-parser-primitive';
import LongCountToken from './complex-tokens/long-count';
import FullDateToken from './complex-tokens/full-date';
import TypeChecker from './type-checker';

import CommentCollapsing from './collapser/comment';
import wildcard from './tokens/wildcard';
import IWindowing from "./windowing/iwindowing";
import TokenBase from "./tokens/tokenBase";


enum State {
  WAITING_TO_START = 0,
  PARSING_LINE = 1,
  FOUND_NUMERIC = 2,
  PARSING_COMMENT = 3
}

class StateContainer {
  state: State;

  constructor(state: State) {
    this.state = state;
  }

  set(newState: State) {
    this.state = newState;
  }

  is(newState: State) {
    return this.state === newState;
  }
}

export default class ComplexCalculatorParser {
  rawText: string;

  constructor(rawText: string) {
    this.rawText = rawText;
  }

  executeWindower(windower: IWindowing, primitiveParts: TokenBase[]) {
    let modifiableParts = primitiveParts;
    const windowAction = windower.setParts(primitiveParts);
    log.trace(`[ComplexCalculatorParser] windowing '${windowAction.constructor.name}'`);
    let windows = windowAction.run();
    while (windows != null) {
      let [start, element, length] = windows;
      modifiableParts = this.replace(modifiableParts, start, element, length);
      windows = windower.setParts(modifiableParts).run();
    }
    return modifiableParts;
  }

  run(): Line[] {
    const lcFactory = new mayadate.factory.LongCountFactory();
    let primitiveParts = new PrimitiveCalculatorParser(this.rawText).run();

    primitiveParts = this.executeWindower(new FullDateWindowing(), primitiveParts);
    primitiveParts = this.executeWindower(new CalendarRoundWindowing(), primitiveParts);
    primitiveParts = this.executeWindower(new OperatorWindowing(), primitiveParts);

    const state = new StateContainer(State.WAITING_TO_START);
    let current: Line = [];
    let cache = [];
    let elements = [];
    for (let i = 0; i < primitiveParts.length; i += 1) {
      const part = primitiveParts[i];
      if (state.is(State.PARSING_COMMENT)) {
        if (TypeChecker.isLineEnd(part)) {
          current.push(new Comment(`${cache.join(' ')}`));
          elements.push(current);
          state.set(State.WAITING_TO_START);
          cache = [];
          current = null;
        } else {
          cache.push(part);
        }
      } else if (state.is(State.WAITING_TO_START)) {
        if (TypeChecker.isLineStart(part)) {
          current = new Line();
          state.set(State.PARSING_LINE);
        } else {
          throw new Error(`State WAITING_TO_START and element ${part} is unexpected`);
        }
      } else if (state.is(State.PARSING_LINE)) {
        if (TypeChecker.isFullDate(part)) {
          current.push(new FullDateToken(part));
        } else if (TypeChecker.isLongCount(part)) {
          current.push(new LongCountToken(part));
        } else if (TypeChecker.isNumeric(part)) {
          let numericResult;
          if (TypeChecker.isInteger(part)) {
            numericResult = part;
          } else {
            numericResult = new LongCountToken(lcFactory.parse(`${part}`));
          }
          current.push(numericResult);
        } else if (TypeChecker.isCommentStart(part)) {
          cache = [];
          state.set(State.PARSING_COMMENT);
        } else if (TypeChecker.isOperator(part)) {
          current.push(part);
        } else if (TypeChecker.isCalendarRound(part)) {
          current.push(part);
        } else if (TypeChecker.isProcessedObj(part)) {
          current.push(part);
        } else if (TypeChecker.isWildcard(part)) {
          current.push(part);
        } else if (TypeChecker.isText(part)) {
          if (part.startsWithWildcard()) {
            current.push(wildcard);
            current.push(part.stripWildcard());
          } else if (part.endsWithWildcard()) {
            current.push(part.stripWildcard());
            current.push(wildcard);
          } else {
            current.push(part);
          }
        } else if (TypeChecker.isLineEnd(part)) {
          elements.push(current);
          state.set(State.WAITING_TO_START);
        } else {
          throw new Error(`State PARSING_LINE and element ${part} is unexpected`);
        }
      } else if (state.is(State.FOUND_NUMERIC)) {
        if (TypeChecker.isText(part)) {
          throw new Error(`State FOUND_NUMERIC and element is_text(${part}) is unexpected`);
        } else {
          throw new Error(`State FOUND_NUMERIC and element ${part} is unexpected`);
        }
      } else {
        throw new Error(`State ${state.state} and element ${part} is unexpected`);
      }
    }

    elements = new CommentCollapsing(elements).run();
    return elements;
  }

  // eslint-disable-next-line class-methods-use-this
  replace(elements: TokenBase[], start: number, element: TokenBase, length: number): TokenBase[] {
    const prefix = elements.slice(0, start);
    const suffix = elements.slice(start + length);
    return prefix.concat([element]).concat(suffix);
  }
}
