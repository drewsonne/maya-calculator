import Comment from '../complex-tokens/comment';

export default class CommentHolder {
  constructor() {
    this.comment = null;
  }

  /**
   *
   * @param newComment
   */
  appendComment(newComment) {
    if (newComment instanceof Comment) {
      if (this.comment === null) {
        this.comment = newComment;
      } else {
        this.comment = new Comment(`${this.comment.raw} ${newComment.raw}`);
      }
    } else {
      this.comment = new Comment(`${this.comment.raw} ${newComment}`);
    }
    return this;
  }

  setComment(comment) {
    this.comment = (typeof comment === 'string') ? new Comment(comment) : comment;
    return this;
  }
}
