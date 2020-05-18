import Base from "./base";

class CommentStart extends Base {
  constructor() {
    super('#');
  }

  equal(other: Base): boolean {
    return this === other;
  }
}

export default new CommentStart();
