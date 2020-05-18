/**
 * Windowing classes will take a list of elements into the constructor
 * and `run()` will return 3 values.
 */
import IWindowing from './windowing/iwindowing'
import TokenBase from "./tokens/tokenBase";

export default abstract class Windowing implements IWindowing {
  parts: TokenBase[];

  constructor() {
    this.parts = []
  }

  abstract run(): null | [number, TokenBase, number]

  setParts(elements: TokenBase[]): IWindowing {
    this.parts = elements;
    return this;
  }

  * windows(start: number, end: number) {
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
  rolling(w: number): TokenBase[][] {
    const n = this.parts.length;
    const result: TokenBase[] [] = [];

    if (n < w || w <= 0) {
      return result;
    }

    for (let i = 0; i < n - w + 1; i += 1) {
      result.push(this.parts.slice(i, w + i));
    }

    return result;
  }
}
