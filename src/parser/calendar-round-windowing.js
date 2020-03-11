import log from 'loglevel'
import CalendarRoundParser from './calendar-round-parser';
import Windowing from './windowing';

export default class CalendarRoundWindowing extends Windowing {
  run() {
    if (this.parts.length < 3) {
      return null;
    }
    const windowGenerator = this.windows(2, 4);
    let windows = windowGenerator.next();
    log.trace('[CalendarRoundWindowing] start scalling for calendar rounds');
    while (!windows.done) {
      windows = windows.value;
      for (let j = 0; j < windows.length; j += 1) {
        const window = windows[j];
        const a = new CalendarRoundParser(...window).run();
        if (a !== null && a !== undefined) {
          log.trace(`[CalendarRoundWindowing] finished scanning and found calendar round: '${a}' at location ${j} for length ${window.length}`);
          return [
            j,
            a,
            window.length
          ];
        }
      }
      windows = windowGenerator.next();
    }
    log.trace('[CalendarRoundWindowing] finish scanning and found no calendar rounds');
    return null;
  }
}
