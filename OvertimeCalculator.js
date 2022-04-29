// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
const ONE_HOUR_IN_MILLIS = 3_600_000

class OvertimeCalculator {
    constructor(excludeCurrentDayFromStatistics, workingsHoursADay) {
        this.excludeCurrentDayFromStatistics = excludeCurrentDayFromStatistics
        this.workingHoursADay = workingsHoursADay
    }

    calculateOvertime(timeData) {
        let actualWorkingTimeInMillis = 0

        let days = 0

        let lastEndDat = undefined
        timeData.forEach(time => {
            const {timeInterval} = time

            if (null == timeInterval.end) { // Exclude currently running time entry
                return
            }

            const start = new Date(timeInterval.start)
            const end = new Date(timeInterval.end)

            if (this.excludeCurrentDayFromStatistics && this.isToday(start)) {
                return
            }

            if (this.areDifferentDays(lastEndDat, start)) {
                days++
            }

            actualWorkingTimeInMillis += end - start

            lastEndDat = end
        })

        const expectedWorkingTimeInMillis = days * this.workingHoursADay * ONE_HOUR_IN_MILLIS
        return actualWorkingTimeInMillis - expectedWorkingTimeInMillis
    }

    isToday(date) {
        const today = new Date()

        return date.toDateString() === today.toDateString()
    }

    areDifferentDays(date1, date2) {
        if (date1 === undefined || date2 === undefined) {
            return true
        }

        return date1.toDateString() !== date2.toDateString()
    }
}

module.exports = OvertimeCalculator;
