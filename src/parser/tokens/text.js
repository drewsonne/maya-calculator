const Base = require('./base');

class Text extends Base {
    get type() {
        return 'text';
    }
}

module.exports = Text;