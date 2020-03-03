import Base from './base';

export default class Numeric extends Base {
  toString() {
    return this.raw_text;
  }
}
