class Comment {
    constructor(text) {
        this.text = text;
    }

    toString() {
        return `# ${this.text}`;
    }
}

module.exports = Comment;