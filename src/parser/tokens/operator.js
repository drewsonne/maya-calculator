import Base from './base';

export default class Operator extends Base {
  toString() {
    return ` ${this.raw_text} `;
  }
}
