import Base from './base';

class LineStart extends Base {
  constructor() {
    super('');
  }

  // eslint-disable-next-line class-methods-use-this
  toString() {
    return 'START_LINE';
  }

  equal(other) {
    return this === other;
  }
}

export default new LineStart();
