import Windowing from './windowing';
import TypeChecker from './type-checker';

export default class OperatorWindowing extends Windowing {
  run() {
    const result3 = this.testTo3Runon();
    return (result3 === null)
      ? this.testTo5Runon()
      : result3;
  }

  testTo5Runon() {
    const windows = this.rolling(5);
    for (let j = 0; j < windows.length; j += 1) {
      const window = windows[j];
      const validFormer = TypeChecker.isLongCount(window[0]);
      const validOperator = TypeChecker.isOperator(window[1]);
      const validLineEnd = TypeChecker.isLineEnd(window[2]);
      const validLineStart = TypeChecker.isLineStart(window[3]);
      const validLatter = TypeChecker.isLongCount(window[4]);
      if (validFormer && validOperator && validLineEnd && validLineStart && validLatter) {
        const result = TypeChecker.isPlusOperator(window[1])
          ? window[0].plus(window[4])
          : window[0].sub(window[4]);
        return [
          j,
          result.equals(),
          window.length
        ];
      }
    }
    return null;
  }

  testTo3Runon() {
    const windows = this.rolling(3);
    if (windows.length >= 2) {
      return windows.reduce((counter, window) => {
        if (Array.isArray(counter)) {
          return counter;
        }
        const validFormer = TypeChecker.isLongCount(window[0]);
        const validOperator = TypeChecker.isOperator(window[1]);
        const validLatter = TypeChecker.isLongCount(window[2]);
        if (validFormer && validOperator && validLatter) {
          const result = TypeChecker.isPlusOperator(window[1])
            ? window[0].plus(window[2])
            : window[0].sub(window[2]);
          return [
            counter,
            result.equals(),
            window.length
          ];
        }
        return counter + 1;
      }, 0);
    }
    return null;
  }
}
