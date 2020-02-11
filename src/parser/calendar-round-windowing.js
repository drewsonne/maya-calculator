const CalendarRoundParser = require('./calendar-round-parser');
const Windowing = require('./windowing');

class CalendarRoundWindowing extends Windowing {

    run() {
        if (this.parts.length < 3) {
            return null;
        }
        let windowGenerator = this.windows(2, 4);
        let windows = windowGenerator.next();
        while (!windows.done) {
            windows = windows.value;
            if (windows.length >= 2) {
                for (let j = 0; j < windows.length; j++) {
                    let window = windows[j];
                    let a = new CalendarRoundParser(...window).run();
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

module.exports = CalendarRoundWindowing;