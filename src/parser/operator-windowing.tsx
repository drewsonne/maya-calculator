import Windowing from './windowing';
import TypeChecker from './type-checker';
import log from "loglevel";
import TokenBase from "./tokens/tokenBase";

export default class OperatorWindowing extends Windowing {
  run(): null | [number, TokenBase, number] {
    log.trace('[OperatorWindowing] start scanning for operator chains');
    let result = this.testTo3Runon();
    if (result === null) {
      result = this.testTo5Runon();
    }
    return result;
  }

  testTo5Runon(): null | [number, TokenBase, number] {
    const windows = this.rolling(5);
    for (let j = 0; j < windows.length; j += 1) {
      const window = windows[j];
      const validFormer = TypeChecker.isLongCount(window[0]);
      const validOperator = TypeChecker.isOperator(window[1]);
      const validLineEnd = TypeChecker.isLineEnd(window[2]);
      const validLineStart = TypeChecker.isLineStart(window[3]);
      const validLatter = TypeChecker.isLongCount(window[4]);
      if (validFormer && validOperator && validLineEnd && validLineStart && validLatter) {
        const result = (
          TypeChecker.isPlusOperator(window[1])
            ? window[0].plus(window[4])
            : window[0].sub(window[4])
        ).equals();
        log.trace(`[OperatorWindowing] finished scanning and found 3-token operator chain: '${result}' at location ${j} for length ${window.length}`);
        return [
          j,
          result,
          window.length
        ];
      }
    }
    log.trace('[OperatorWindowing] finish scanning and found no 3-token operator chains');
    return null;
  }

  testTo3Runon(): null | [number, TokenBase, number] {
    const windows = this.rolling(3);
    if (windows.length >= 2) {
      const resultA = windows.reduce((counter, window) => {
        if (Array.isArray(counter)) {
          return counter;
        }
        const validFormer = TypeChecker.isLongCount(window[0]);
        const validOperator = TypeChecker.isOperator(window[1]);
        const validLatter = TypeChecker.isLongCount(window[2]);
        if (validFormer && validOperator && validLatter) {
          const result = (
            TypeChecker.isPlusOperator(window[1])
              ? window[0].plus(window[2])
              : window[0].sub(window[2])
          ).equals();
          log.trace(`[OperatorWindowing] finished scanning and found 5-token operator chain: '${result}' at location ${counter} for length ${window.length}`);
          return [
            counter,
            result,
            window.length
          ];
        }
        return counter + 1;
      }, 0);
      return Array.isArray(resultA) ? resultA : null;
    }
    log.trace('[OperatorWindowing] finish scanning and found no 5-token operator chains');
    return null;
  }
}
