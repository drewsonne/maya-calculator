import TypeChecker from '../type-checker';
import React from 'react';
import mayadates from "@drewsonne/maya-dates";

export default class LongCount {
  constructor(long_count) {
    this.long_count_obj = long_count;
  }

  get lc() {
    return this.long_count_obj;
  }

  process(registry) {
    let registryLength = registry.length;
    let registryEntry = this;
    if (registryLength > 1) {
      const hasOperator = TypeChecker.is_operator(registry[registryLength - 1]);
      const hasLc = TypeChecker.is_long_count_token(registry[registryLength - 2]);
      if (hasOperator && hasLc) {
        const operator = registry.pop();
        const formerLongCount = registry.pop();
        const latterLongCount = this;
        registry.push(TypeChecker.is_plus_operator(operator) ?
          latterLongCount.plus(formerLongCount) :
          latterLongCount.minus(formerLongCount)
        );
      }
    } else if (registryEntry.long_count_obj.isPartial()) {
      for (let lc of new mayadates.op.LongCountWildcard(registryEntry.long_count_obj).run()) {
        registry.push(
          new LongCount(lc)
        );
      }
    } else {
      registry.push(
        registryEntry
      );
    }
    return registry;
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
