// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
const ONE_HOUR_IN_MILLIS = 3_600_000

class OvertimeCalculator {
    constructor(excludeCurrentDayFromStatistics, workingsHoursADay) {
        this.excludeCurrentDayFromStatistics = excludeCurrentDayFromStatistics
        this.workingHoursADay = workingsHoursADay
    }

    // TODO: Work even if timeData is empty (e.g. "2021":{})
    // TODO: Implement functionality to exclude certain entries from the calculation (e.g by setting a tag or something else on the entry)
    /**
     * @param {TimeEntryCollection} timeData
     * @returns {number}
     */
    calculateOvertime(timeData) {
        let actualWorkingTimeInMillis = 0

        let days = 0

        let lastEndDat = undefined
        timeData.collection.forEach(time => {
            if (null == time.end) { // Exclude currently running time entry
                return // TODO: Set end date to current time if its not finished yet and the user disabled excludeCurrentDayFromStatistics toggle
            }

            if (this.excludeCurrentDayFromStatistics && this.isToday(time.start)) {
                return
            }

            if (this.areDifferentDays(lastEndDat, time.start)) {
                days++
            }

            actualWorkingTimeInMillis += time.end - time.start

            lastEndDat = time.end
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
