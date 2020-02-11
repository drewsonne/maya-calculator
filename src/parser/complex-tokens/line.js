class Line {
  constructor(...parts) {
    this.parts = parts;
  }

  push(part) {
    this.parts.push(part);
  }

  toString() {
    return `${this.parts.join(' ')}`;
  }

  * [Symbol.iterator]() {
    for (let token of this.parts) {
      yield token;
    }
  }
}

module.exports = Line;