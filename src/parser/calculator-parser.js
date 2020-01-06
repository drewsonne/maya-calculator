const linestart = require('./tokens/line-start');
const lineend = require('./tokens/line-end');
const commentstart = require('./tokens/comment-start');
const Text = require('./tokens/text');
const Numeric = require('./tokens/numeric');
const Operator = require('./tokens/operator');

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
                    if (['+', '-'].includes(part[0])) {
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
                        throw `Unexpected token found (${part}) in line (${line})`;
                    }
                }
            }
            tokens.push(lineend);
        }
        return tokens;
    }
}


const Line = require('./complex-tokens/line');
const Comment = require('./complex-tokens/comment');
const CalendarRoundWindowing = require('./calendar-round-windowing');
const FullDateWindowing = require('./full-date-windowing');
const mayaDate = require('@drewsonne/maya-dates');

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

    constructor(raw_text) {
        this.raw_text = raw_text;
    }

    run() {
        let lcFactory = new mayaDate.factory.LongCountFactory();
        let crFactory = new mayaDate.factory.CalendarRoundFactory();
        let primitiveParts = new PrimitiveCalculatorParser(this.raw_text).run();

        let fullDateParsed = new FullDateWindowing(primitiveParts).run();
        while (fullDateParsed !== null) {
            let index = fullDateParsed[0];
            let fullDate = crParsed[1];
            let length = crParsed[2];
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
        let current = undefined;
        let cache = [];
        let elements = [];
        for (let i = 0; i < primitiveParts.length; i++) {
            let part = primitiveParts[i];
            if (state.is(PARSING_COMMENT)) {
                if (this.is_line_end(part)) {
                    current.push(new Comment(`${cache.join(' ')}`));
                    elements.push(current);
                    state.set(WAITING_TO_START);
                    cache = [];
                    current = null;
                } else {
                    cache.push(part);
                }
            } else if (state.is(WAITING_TO_START)) {
                if (this.is_line_start(part)) {
                    current = new Line();
                    state.set(PARSING_LINE);
                } else {
                    throw `State WAITING_TO_START and element ${part} is unexpected`;
                }
            } else if (state.is(PARSING_LINE)) {
                if (this.is_numeric(part)) {
                    let lcResult = lcFactory.parse(`${part}`);
                    current.push(lcResult);
                    continue;
                } else if (this.is_comment_start(part)) {
                    cache = [];
                    state.set(PARSING_COMMENT);
                } else if (this.is_operator(part)) {
                    current.push(part);
                } else if (this.is_line_end(part)) {
                    elements.push(
                        current
                    );
                    state.set(WAITING_TO_START);
                } else if (this.is_calendar_round(part)) {
                    current.push(part);
                } else if (this.is_processed_obj(part)) {
                    current.push(part)
                } else {
                    throw `State PARSING_LINE and element ${part} is unexpected`;
                }
            } else if (state.is(FOUND_NUMERIC)) {
                if (this.is_text(part)) {
                    throw `State FOUND_NUMERIC and element is_text(${part}) is unexpected`;
                } else {
                    throw `State FOUND_NUMERIC and element ${part} is unexpected`;
                }
            } else {
                throw `State ${state.state} and element ${part} is unexpected`;
            }
        }
        return elements;
    }

    is_processed_obj(part) {
        return part instanceof mayaDate.cr.CalendarRound || part instanceof mayaDate.lc.LongCount;
    }

    is_line_start(part) {
        return part === linestart;
    }

    is_line_end(part) {
        return part === lineend;
    }

    is_comment_start(part) {
        return part === commentstart;
    }

    is_text(part) {
        return part instanceof Text;
    }

    is_numeric(part) {
        return part instanceof Numeric;
    }

    is_operator(part) {
        return part instanceof Operator;
    }

    is_calendar_round(part) {
        return part instanceof mayaDate.cr.CalendarRound;
    }

}

module.exports = {
    'PrimitiveCalculatorParser': PrimitiveCalculatorParser,
    'ComplexCalculatorParser': ComplexCalculatorParser
};