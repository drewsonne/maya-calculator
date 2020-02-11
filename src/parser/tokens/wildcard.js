const Base = require('./base');

class Wildcard extends Base {
  toString() {
    return this.raw_text;
  }
}

module.exports = Wildcard;