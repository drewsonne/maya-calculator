import Base from './base';

class CommentStart extends Base {
  constructor() {
    super('#');
  }

  equal(other) {
    return this === other;
  }
}

export default new CommentStart();
