import Comment from '../complex-tokens/comment';
import CommentHolder from './comment-holder-interface';

export default class TokenBase extends CommentHolder {
  constructor(rawText) {
    super();
    this.raw_text = rawText;
  }

  equal(other) {
    return other.raw_text === this.raw_text;
  }

  toString() {
    return this.raw_text;
  }

  isCoeff() {
    return /^[\d*]+$/.test(this.raw_text);
  }

  process(registry) {
    registry.push(this);
    return registry;
  }

}
