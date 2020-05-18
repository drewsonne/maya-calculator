import Base from "./base";

class LineStart extends Base {
  constructor() {
    super('');
  }

  // eslint-disable-next-line class-methods-use-this
  toString(): string {
    return 'START_LINE';
  }

  equal(other: Base): boolean {
    return this === other;
  }
}

export default new LineStart();
