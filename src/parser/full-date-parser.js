import mayadates from '@drewsonne/maya-dates';
import TypeChecker from './type-checker';

// 5Imix *Sek 1.1.1.*.*
export default class FullDateParser {
  constructor(...lineParts) {
    this.lineParts = lineParts;
  }

  run() {
    const isValidCR = TypeChecker.isCalendarRound(this.lineParts[0]);
    const isLCNumeric = TypeChecker.isNumeric(this.lineParts[1]);
    if (isLCNumeric) {
      this.lineParts[1] = new mayadates.factory.LongCountFactory().parse(`${this.lineParts[1]}`);
    }
    const isValidLC = TypeChecker.isLongCount(this.lineParts[1]);
    if (isValidCR && isValidLC) {
      return new mayadates.FullDate(...this.lineParts);
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  replace(elements, start, element, length) {
    const prefix = elements.slice(0, start);
    const suffix = elements.slice(start + length);
    return prefix.concat([element]).concat(suffix);
  }
}
