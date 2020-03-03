export default class Windowing {
  constructor(elements) {
    this.parts = elements;
  }

  * windows(start, end) {
    const lower = Math.min(start, end);
    const upper = Math.max(start, end);
    for (let i = upper; i >= lower; i -= 1) {
      yield this.rolling(i);
    }
    return null;
  }

  /**
   * Produces a rolling window of desired length {w} on a 1d array.
   *
   * @param {Number} w The desired window size.
   * @return {Array} A multi-dimensional array of windowed values.
   */
  rolling(w) {
    const n = this.parts.length;
    const result = [];

    if (n < w || w <= 0) {
      return result;
    }

    for (let i = 0; i < n - w + 1; i += 1) {
      result.push(this.parts.slice(i, w + i));
    }

    return result;
  }
}
