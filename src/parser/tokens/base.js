class TokenBase {
    constructor(raw_text) {
        this.raw_text = raw_text;
    }

    equal(other) {
        return other.raw_text === this.raw_text;
    }

    toString() {
        return this.raw_text;
    }

    is_coeff() {
        return /^[\d*]+$/.test(this.raw_text);
    }
}

module.exports = TokenBase;