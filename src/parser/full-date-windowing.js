import FullDateParser from './full-date-parser';
import Windowing from './windowing';


export default class FullDateWindowing extends Windowing {
  run() {
    // debugger;
    if (this.parts.length < 2) {
      return null;
    }
    const windowGenerator = this.windows(2, 4);
    let windows = windowGenerator.next();
    while (!windows.done) {
      windows = windows.value;
      if (windows.length >= 2) {
        for (let j = 0; j < windows.length; j += 1) {
          const window = windows[j];
          const a = new FullDateParser(...window).run();
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
