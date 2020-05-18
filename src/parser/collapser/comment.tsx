import Collapser from './base';
import TypeChecker from '../type-checker';

export default class CommentCollapser extends Collapser {
  run() {
    return this.lines.map((line) => {
      let lastPart = null;
      let isComment = false;
      for (let j = 0; j < line.length; j += 1) {
        const part = line.get(j);
        if (isComment) {
          lastPart.appendComment(part);
          line.lineParts.splice(j, 1);
          j -= 1;
        } else if (TypeChecker.isComment(part)) {
          isComment = true;
          if (lastPart === null) {
            lastPart = part;
          } else {
            lastPart.appendComment(part);
            line.lineParts.splice(j, 1);
            j -= 1;
          }
        } else {
          lastPart = part;
        }
      }
      return line;
    });
  }
}
