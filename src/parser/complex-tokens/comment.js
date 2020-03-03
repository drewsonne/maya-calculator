export default class Comment {
  constructor(text) {
    this.commentText = text;
  }

  get raw() {
    return this.commentText;
  }

  toString() {
    return `# ${this.commentText}`;
  }
}
