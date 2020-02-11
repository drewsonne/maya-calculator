const Base = require('./base');

class Operator extends Base {

    toString() {
        return ` ${this.raw_text} `;
    }
}

module.exports = Operator;