import CalendarRoundParser from './calendar-round-parser';
import Windowing from './windowing';

export default class CalendarRoundWindowing extends Windowing {
  run() {
    if (this.parts.length < 3) {
      return null;
    }
    const windowGenerator = this.windows(2, 4);
    let windows = windowGenerator.next();
    while (!windows.done) {
      windows = windows.value;
      if (windows.length >= 2) {
        for (let j = 0; j < windows.length; j += 1) {
          const window = windows[j];
          const a = new CalendarRoundParser(...window).run();
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
