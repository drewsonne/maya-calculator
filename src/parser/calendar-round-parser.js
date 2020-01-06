const Numeric = require('./tokens/numeric');
const Text = require('./tokens/text');
const mayaDate = require('@drewsonne/maya-dates');

const FOUR_PART = 0;
const THREE_PART_BIG_ENDIAN = 1;
const THREE_PART_LITTLE_ENDIAN = 2;
const TWO_PART = 4;


class CalendarRoundParser {

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
        let cr_type = this.is_valid();
        if (cr_type === undefined) {
            return undefined;
        }
        let factory = new mayaDate.factory.CalendarRoundFactory();
        let date_string = this.toString();
        let cr;
        try {
            cr = factory.parse(date_string);
        } catch (err) {
            cr = null;
        }
        return cr;
    }

    is_valid() {
        if (this.length === 4) {
            if (this.is_four_part()) {
                return FOUR_PART;
            }
        } else if (this.length === 3) {
            if (this.is_three_part_big_endian()) {
                return THREE_PART_BIG_ENDIAN;
            } else if (this.is_three_part_little_endian()) {
                return THREE_PART_LITTLE_ENDIAN;
            }
        } else if (this.length === 2) {
            if (this.is_two_part()) {
                return TWO_PART;
            }
        }
        return undefined;
    }


    is_four_part() {
        let num_parts = this.parts.length;
        if (
            !(this.parts[0] instanceof Numeric) ||
            !(this.parts[2] instanceof Numeric)
        ) {
            return false;
        }
        if (
            !(this.parts[1] instanceof Text) ||
            !(this.parts[3] instanceof Text)
        ) {
            return false;
        }
        let valid_coefficients = this.parts[0].is_coeff()
            && !this.parts[1].is_coeff()
            && this.parts[2].is_coeff()
            && !this.parts[3].is_coeff();

        return valid_coefficients && (num_parts === 4);
    }

    is_three_part() {
        let num_parts = this.parts.length;
        return num_parts === 3;
    }

    is_three_part_big_endian() {
        return (
            (this.parts[0] instanceof Text) &&
            (this.parts[1] instanceof Numeric) &&
            (this.parts[2] instanceof Text)
        );
    }

    is_three_part_little_endian() {
        return (
            (this.parts[0] instanceof Numeric) &&
            (this.parts[1] instanceof Text) &&
            (this.parts[2] instanceof Text)
        );
    }

    is_two_part() {
        let is_valid = (
            (this.parts[0] instanceof Text) &&
            (this.parts[1] instanceof Text)
        );
        return is_valid
    }
}


module.exports = CalendarRoundParser;