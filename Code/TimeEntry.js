// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
class TimeEntry {

    /**
     * @param {Date} start
     * @param {Date} end
     * @param {string} duration
     */
    constructor(start, end, duration) {
        this.start = start
        this.end = end
        this.duration = duration
    }

    toJSON() {
        return {
            timeInterval: {
                start: this.start,
                end: this.end,
                duration: this.duration
            }
        }
    }
}

module.exports = TimeEntry;
