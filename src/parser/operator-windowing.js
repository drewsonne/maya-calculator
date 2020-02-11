import Windowing from './windowing';
import TypeChecker from './type-checker';

export default class OperatorWindowing extends Windowing {

  run() {
    if (this.parts.length < 3) {
      return null;
    }
    const result_3 = this.test_to_3_runon();
    if (result_3 !== null) {
      return result_3;
    }

    const result_5 = this.test_to_5_runon();
    if (result_5 !== null) {
      return result_5;
    }
  }

  test_to_5_runon() {
    let windowGenerator = this.windows(5, 5);
    let windows = windowGenerator.next();
    while (!windows.done) {
      windows = windows.value;
      for (let j = 0; j < windows.length; j++) {
        const window = windows[j];
        let validFormer = TypeChecker.is_long_count(window[0]);
        let validOperator = TypeChecker.is_operator(window[1]);
        let validLineEnd = TypeChecker.is_line_end(window[2]);
        let validLineStart = TypeChecker.is_line_start(window[3]);
        let validLatter = TypeChecker.is_long_count(window[4]);
        if (validFormer && validOperator && validLineEnd && validLineStart && validLatter) {
          let result = TypeChecker.is_plus_operator(window[1]) ?
            window[0].plus(window[4]) :
            window[0].sub(window[4]);
          return [
            j,
            result,
            window.length
          ];
        }
      }
    }
  }

  test_to_3_runon() {
    let windowGenerator = this.windows(3, 3);
    let windows = windowGenerator.next();
    while (!windows.done) {
      windows = windows.value;
      for (let j = 0; j < windows.length; j++) {
        const window = windows[j];
        let validFormer = TypeChecker.is_long_count(window[0]);
        let validOperator = TypeChecker.is_operator(window[1]);
        let validLatter = TypeChecker.is_long_count(window[2]);
        if (validFormer && validOperator && validLatter) {
          let result = TypeChecker.is_plus_operator(window[1]) ?
            window[0].plus(window[2]) :
            window[0].sub(window[2]);
          return [
            j,
            result,
            window.length
          ];
        }
      }
      windows = windowGenerator.next();
    }
    return null;
  }
}