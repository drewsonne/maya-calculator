class Line {
    constructor(...parts) {
        this.parts = parts;
    }

    push(part) {
        this.parts.push(part);
    }

    toString() {
        return `${this.parts.join(' ')}`;
    }
}

module.exports = Line;