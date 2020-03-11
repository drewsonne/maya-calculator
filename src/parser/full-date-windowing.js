import log from 'loglevel';
import FullDateParser from './full-date-parser';
import Windowing from './windowing';


export default class FullDateWindowing extends Windowing {
  run() {
    // debugger;
    if (this.parts.length > 2) {
      return null;
    }
    const windowGenerator = this.windows(2, 2);
    let windows = windowGenerator.next();
    log.trace('[FullDateWindowing] start scanning for full date windows');
    while (!windows.done) {
      windows = windows.value;
      for (let j = 0; j < windows.length; j += 1) {
        const window = windows[j];
        const a = new FullDateParser(...window).run();
        if (a !== null && a !== undefined) {
          log.trace(`[FullDateWindowing] finished scanning and found full date: '${a}' at location ${j} for length ${window.length}`);
          return [
            j,
            a,
            window.length
          ];
        }
      }
      windows = windowGenerator.next();
    }
    log.trace('[FullDateWindowing] finish scanning and found no full dates');
    return null;
  }
}
