export default abstract class TokenBase {
  raw_text: string;

  constructor(rawText: string) {
    this.raw_text = rawText;
  }

  equal(other: TokenBase): boolean {
    return other.raw_text === this.raw_text;
  }

  toString(): string {
    return this.raw_text;
  }

  isCoeff(): boolean {
    return /^[\d*]+$/.test(this.raw_text);
  }

  process(registry) {
    registry.push(this);
    return registry;
  }

}
