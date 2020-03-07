export default class Line {
  constructor(...parts) {
    this.lineParts = parts;
  }

  process(registry) {
    registry.push(this);
    return registry;
  }

  get(index) {
    return this.lineParts[index];
  }

  push(part) {
    this.lineParts.push(part);
    return this;
  }

  toString() {
    return `${this.lineParts.join(' ')}`;
  }

  merge(latterLine) {
    return latterLine.lineParts.reduce(
      (line, token) => line.push(token),
      new Line(...this.lineParts)
    );
  }

  reduce(func, initial) {
    return this.lineParts.reduce(func, initial);
  }

  map(func) {
    return new Line(...this.lineParts.map(func));
  }

  mapWindow(length, func) {
    for (let start = 0; start < this.lineParts.length - length; start += 1) {
      func(this.lineParts.slice(start, start + length));
    }
  }

  equal(otherLine) {
    let isEqual = true;
    for (let i = 0; i < this.length; i += 1) {
      isEqual = isEqual && this.get(i).equal(
        otherLine.get(i)
      );
      i = (isEqual) ? this.length : i;
    }
    return isEqual;
  }

  get length() {
    return this.lineParts.length;
  }

  * [Symbol.iterator]() {
    for (const token of this.lineParts) {
      yield token;
    }
  }
}
