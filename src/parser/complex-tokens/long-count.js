import mayadates from '@drewsonne/maya-dates';
import CommentHolder from '../tokens/comment-holder-interface';

export default class LongCount extends CommentHolder {
  constructor(longCount) {
    super();
    this.long_count_obj = longCount;
  }

  get lc() {
    return this.long_count_obj;
  }

  process(registry) {
    return (this.long_count_obj.isPartial())
      ? new mayadates.op.LongCountWildcard(
        this.long_count_obj
      ).run().reduce(
        (elemRegistry, lc) => elemRegistry.concat([new LongCount(lc)]),
        registry
      )
      : registry.concat(
        [this]
      );
  }

  toString() {
    return this.long_count_obj.toString();
  }

  plus(lc) {
    return new LongCount(this.long_count_obj.plus(lc.long_count_obj).equals());
  }

  minus(lc) {
    return new LongCount(this.long_count_obj.minus(lc.long_count_obj).equals());
  }
}
