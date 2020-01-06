const Base = require('./base');

class Numeric extends Base {

    toString() {
        return this.raw_text;
    }
}

Numeric.prototype.TYPE = 'numeric';

module.exports = Numeric;