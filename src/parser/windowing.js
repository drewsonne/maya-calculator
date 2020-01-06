class Windowing {
    constructor(elements) {
        this.parts = elements;
    }

    * windows(start, end) {
        for (let i = end; i >= start; i--) {
            yield this.rolling(i);
        }
        return null;

    }

    /**
     * Produces a rolling window of desired length {w} on a 1d array.
     *
     * @param {Array} a The 1d array to window.
     * @param {Number} w The desired window size.
     * @return {Array} A multi-dimensional array of windowed values.
     */
    rolling(w) {
        let n = this.parts.length;
        let result = [];

        if (n < w || w <= 0) {
            return result;
        }

        for (let i = 0; i < n - w + 1; i++) {
            result.push(this.parts.slice(i, w + i));
        }

        return result;
    }
}

module.exports = Windowing;