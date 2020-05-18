import Base from "./base";

export default class Numeric extends Base {
  toString(): string {
    return this.raw_text;
  }

  isLongCount(): boolean {
    return this.raw_text.includes('.');
  }
}
