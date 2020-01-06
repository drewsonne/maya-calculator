const Base = require('./base');

class LineStart extends Base {

    toString() {
        return 'START_LINE';
    }

    equal(other) {
        return this === other;
    }
}

module.exports = new LineStart();