import Base from "./base";

class Wildcard extends Base {
  constructor() {
    super('*');
  }

  toString(): string {
    return this.raw_text;
  }
}

export default new Wildcard();
