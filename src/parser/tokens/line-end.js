import Base from './base';

class LineEnd extends Base {
  constructor() {
    super('');
  }

  // eslint-disable-next-line class-methods-use-this
  toString() {
    return 'END_LINE';
  }

  equal(other) {
    return this === other;
  }
}

export default new LineEnd();
