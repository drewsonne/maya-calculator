import mayaDate from '@drewsonne/maya-dates';
import Numeric from './tokens/numeric';
import Text from './tokens/text';


const FOUR_PART = 0;
const THREE_PART_BIG_ENDIAN = 1;
const THREE_PART_LITTLE_ENDIAN = 2;
const TWO_PART = 4;


export default class CalendarRoundParser {
  /**
   *
   * @param parts {TokenBase[]}
   */
  constructor(...parts) {
    this.parts = parts;
  }

  get length() {
    return this.parts.length;
  }

  toString() {
    return `${this.parts.join(' ')}`;
  }

  /**
   *
   * @return {CalendarRound|undefined}
   */
  run() {
    const crType = this.isValid();
    if (crType === undefined) {
      return undefined;
    }
    const factory = new mayaDate.factory.CalendarRoundFactory();
    const dateString = this.toString();
    let cr;
    try {
      cr = factory.parse(dateString);
    } catch (err) {
      cr = null;
    }
    return cr;
  }

  isValid() {
    if (this.length === 4) {
      if (this.isFourPart()) {
        return FOUR_PART;
      }
    } else if (this.length === 3) {
      if (this.isThreePartBigEndian()) {
        return THREE_PART_BIG_ENDIAN;
      }
      if (this.isThreePartLittleEndian()) {
        return THREE_PART_LITTLE_ENDIAN;
      }
    } else if (this.length === 2) {
      if (this.isTwoPart()) {
        return TWO_PART;
      }
    }
    return undefined;
  }


  isFourPart() {
    const numParts = this.parts.length;
    if (
      !(this.parts[0] instanceof Numeric)
      || !(this.parts[2] instanceof Numeric)
    ) {
      return false;
    }
    if (
      !(this.parts[1] instanceof Text)
      || !(this.parts[3] instanceof Text)
    ) {
      return false;
    }
    const validCoefficients = this.parts[0].isCoeff()
      && !this.parts[1].isCoeff()
      && this.parts[2].isCoeff()
      && !this.parts[3].isCoeff();

    return validCoefficients && (numParts === 4);
  }

  isThreePart() {
    return this.parts.length === 3;
  }

  isThreePartBigEndian() {
    return (
      (this.parts[0] instanceof Text)
      && (this.parts[1] instanceof Numeric)
      && (this.parts[2] instanceof Text)
    );
  }

  isThreePartLittleEndian() {
    return (
      (this.parts[0] instanceof Numeric)
      && (this.parts[1] instanceof Text)
      && (this.parts[2] instanceof Text)
    );
  }

  isTwoPart() {
    return (
      (this.parts[0] instanceof Text)
      && (this.parts[1] instanceof Text)
    );
  }
}
