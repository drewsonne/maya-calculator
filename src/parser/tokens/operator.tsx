import Base from "./base";

export default class Operator extends Base {
  toString(): string {
    return ` ${this.raw_text} `;
  }
}
