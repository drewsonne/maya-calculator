const Base = require('./base');

class LineEnd extends Base {

    toString() {
        return 'END_LINE';
    }

    equal(other) {
        return this === other;
    }
}

module.exports = new LineEnd();