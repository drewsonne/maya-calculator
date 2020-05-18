import Comment from "../complex-tokens/comment";
import TokenBase from "./base";

export default abstract class CommentHolder extends TokenBase {
    comment: Comment | null;

    constructor() {
        super('');
        this.comment = null;
    }

    /**
     *
     * @param newComment
     */
    appendComment(newComment: Comment | string) {
        if (this.comment === null) {
            this.comment = new Comment('');
        }

        this.comment = new Comment(`${this.comment.raw} ${
            (newComment instanceof Comment) ? newComment.raw : newComment
        }`);
        return this;
    }

    setComment(comment: Comment | string) {
        this.comment = (typeof comment === 'string') ? new Comment(comment) : comment;
        return this;
    }
}
