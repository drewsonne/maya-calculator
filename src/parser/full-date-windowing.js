const Windowing = require('./windowing');
import FullDateParser from './full-date-parser';

class FullDateWindowing extends Windowing {
  run() {
    debugger;
    if (this.parts.length < 2) {
      return null;
    }
    let windowGenerator = this.windows(2, 4);
    let windows = windowGenerator.next();
    while (!windows.done) {
      windows = windows.value;
      if (windows.length >= 2) {
        for (let j = 0; j < windows.length; j++) {
          let window = windows[j];
          let a = new FullDateParser(...window).run();
          if (a !== null && a !== undefined) {
            return [
              j,
              a,
              window.length
            ];
          }
        }
      }
      windows = windowGenerator.next();
    }
    return null;
  }
}

module.exports = FullDateWindowing;