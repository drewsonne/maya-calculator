const repl = require('repl');

class MayaCalculator {
    constructor() {
        this.stack = [];
    }

    evaluate(line, callback) {
        this.stack.push(
            new LongCount(line)
        );
        console.log(this.stack);
        if (this.can_operate()) {
            callback(null,this.operate());
        } else {
            return callback(repl.Recoverable());
        }
    }
    can_operate() {
        if (this.stack.length == 2) {
            if(
                !this.stack[0].has_operator()
                &
                this.stack[1].has_operator()
            ) {
                return Boolean(1);
            }
        }
        return Boolean(0);
    }
}

class LongCount {
    constructor(raw) {
        this.raw = raw.trim();
    }

}

class DistanceNumber {
    constructor(raw) {
        this.raw = raw.trim();
    }
}

function number_factory(raw) {
    function has_operator(raw) {
        return Boolean(raw[0] == '-' | raw[1] == '+');
    }

    if (has_operator(raw)) {
        return DistanceNumber(raw);
    } else {
        return LongCount(raw);
    }

}


const calculator = new MayaCalculator();

function eval_long_count(cmd, context, filename, callback) {
    calculator.evaluate(cmd, callback);
}

export function cli(args) {
  var replServer = repl.start({
    prompt: "maya-calendar > ",
    eval: eval_long_count
  });
}
