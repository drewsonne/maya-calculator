import TokenBase from "../tokens/base";

export default class Comment extends TokenBase {
  commentText: string;

  constructor(text: string) {
    super('');
    this.commentText = text;
  }

  get raw(): string {
    return this.commentText;
  }

  toString(): string {
    return `# ${this.commentText}`;
  }
}
