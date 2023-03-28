// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
const TimeEntry = importModule('TimeEntry')

class TimeEntryCollection {
    constructor(json) {
        this.collection = []

        json.forEach(time => {
            const {timeInterval} = time

            this.add(new TimeEntry(
                new Date(timeInterval.start),
                new Date(timeInterval.end),
                timeInterval.duration
            ))
        })
    }

    add(timeEntry) {
        this.collection.push(timeEntry)
    }

    toJSON() {
        let output = []
        this.collection.forEach(timeEntry => {
            output.push(timeEntry.toJSON())
        })

        return output
    }
}

module.exports = TimeEntryCollection;
