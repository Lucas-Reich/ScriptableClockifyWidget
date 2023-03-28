// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: business-time;
const ClockifyOvertimeRepository = importModule('ClockifyOvertimeRepository');
const OvertimeCalculator = importModule('OvertimeCalculator');
const Environment = importModule('Environment')

const ERR_RES_MISSING_API_KEY = "API key angeben!"
const ERR_RES_DATA_LOADING_ISSUE = "Daten konnten nicht geladen werden!"

class ClockifyOvertimeWidget {
    constructor() {
        this.environment = new Environment()

        this.repository = new ClockifyOvertimeRepository(this.environment.getAPIKey())
        this.overtimeCalculator = new OvertimeCalculator(
            this.environment.getExcludeCurrentDayFromStatistics(),
            this.environment.getDailyWorkingHours()
        )
        this.timeFormatter = new TimeFormatter()
    }

    async run() {
        let widget = await this.buildWidget()
        if (!config.runsInWidget) {
            await widget.presentSmall()
        }
        Script.setWidget(widget)
        Script.complete()
    }

    async buildWidget() {
        let listWidget = new ListWidget()

        const data = await this.calculateAccruedOvertimeSince(this.environment.getCalculateWorkingTimeSince())
        if ("error" in data) {
            listWidget.addText(data.error)
        } else {
            listWidget.addText(this.timeFormatter.formatMillis(data.overtime))
        }

        return listWidget
    }

    async calculateAccruedOvertimeSince(year) {
        try {
            let overtime = 0
            while (year <= new Date().getFullYear()) { // TODO: Stop fetching data if nothing is returned by the repository
                const timeData = await this.repository.getOvertimeForYear(year)
                overtime += this.overtimeCalculator.calculateOvertime(timeData)
                year++
            }

            return {overtime: overtime}
        } catch (e) {
            console.log(e)

            if (e === "InvalidAPIKeyException") {
                return {error: ERR_RES_MISSING_API_KEY}
            }

            if (e === "InvalidClockifyResponse") {
                return {error: ERR_RES_DATA_LOADING_ISSUE}
            }

            return {error: ERR_RES_DATA_LOADING_ISSUE}
        }
    }
}

class TimeFormatter {
    formatMillis(millis) {
        const ms = millis % 1000;
        millis = (millis - ms) / 1000;

        const secs = millis % 60;
        millis = (millis - secs) / 60;

        const mins = millis % 60;
        const hrs = (millis - mins) / 60;

        return this.pad(hrs) + ':' + this.pad(mins);
    }

    pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }
}

await new ClockifyOvertimeWidget().run()
