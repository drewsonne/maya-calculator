import Base from './base';

export default class Text extends Base {
  startsWithWildcard() {
    return this.raw_text[0] === '*';
  }

  endsWithWildcard() {
    return this.raw_text[this.raw_text.length - 1] === '*';
  }

  stripWildcard() {
    if (this.startsWithWildcard()) {
      return new Text(this.raw_text.slice(1));
    } else {
      return;
    }
  }
}
