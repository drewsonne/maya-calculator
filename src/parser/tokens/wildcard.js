import Base from './base';

class Wildcard extends Base {
  constructor() {
    super('*');
  }

  toString() {
    return this.raw_text;
  }
}

export default new Wildcard();
