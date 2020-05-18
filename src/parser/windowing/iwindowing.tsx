import TokenBase from "../tokens/tokenBase";

export default interface IWindowing {
  setParts(parts: TokenBase[]): IWindowing

  run(): null | [number, TokenBase, number];
}
