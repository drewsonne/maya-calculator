import Base from "./base";

export default class Text extends Base {
  startsWithWildcard(): boolean {
    return this.raw_text[0] === '*';
  }

  endsWithWildcard(): boolean {
    return this.raw_text[this.raw_text.length - 1] === '*';
  }

  stripWildcard(): Text | undefined {
    if (this.startsWithWildcard()) {
      return new Text(this.raw_text.slice(1));
    } else {
      return;
    }
  }
}
