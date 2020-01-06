const Base = require('./base');

class CommentStart extends Base {
    constructor() {
        super('#');
    }

    equal(other) {
        return this === other;
    }
}

module.exports = new CommentStart();