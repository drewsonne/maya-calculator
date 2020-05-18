import mayadates from '@drewsonne/maya-dates';
import CommentHolder from "../tokens/comment-holder";

export default class FullDate extends CommentHolder {
  constructor(fullDate:mayadates.) {
    super();
    this.full_date_obj = fullDate;
  }

  get lc() {
    return this.full_date_obj.lc;
  }

  get cr() {
    return this.full_date_obj.cr;
  }

  process(registry) {
    const crIsPartial = this.cr.isPartial();
    const lcIsPartial = this.lc.isPartial();
    if (crIsPartial || lcIsPartial) {
      const fullDates = new mayadates.op.FullDateWildcard(this.full_date_obj).run();
      for (const fullDate of fullDates) {
        registry.push(fullDate);
      }
      return registry;
    } else {
      return registry.concat(
        [this]
      );
    }
  }

  toString() {
    return this.full_date_obj.toString();
  }
}
