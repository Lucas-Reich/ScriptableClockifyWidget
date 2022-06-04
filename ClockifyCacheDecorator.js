// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

const CACHE_KEY_TIME_ENTRIES = "time_entries"

class ClockifyCacheDecorator {
    constructor(cache) {
        this.cache = cache
    }

    async cacheTimeEntries(timeEntries) {
        let cachedTimeEntries = await this.cache.read(CACHE_KEY_TIME_ENTRIES, null) // TODO: How do I want to treat outdated data

        timeEntries.forEach(timeEntry => {
            const date = this.toDateString(new Date(timeEntry['timeInterval']['start']))

            if (cachedTimeEntries[date] == null || cachedTimeEntries[date] === undefined) {
                cachedTimeEntries[date] = []
            }

            cachedTimeEntries[date].push({
                'fetched_at': Date.now(), // TODO: Should I instead set an expiry_date as of which the entry is not valid anymore
                'data': timeEntry
            })
        })

        this.cache.write(CACHE_KEY_TIME_ENTRIES, cachedTimeEntries)
    }

    async retrieveTimeEntries(from, to) {
        const cachedTimeEntries = await this.cache.read(CACHE_KEY_TIME_ENTRIES, null)

        const fromDate = new Date(from)
        const toDate = new Date(to)

        let output = []
        Object.keys(cachedTimeEntries).forEach((key) => {
            const timeEntryTime = new Date(key)
            if (timeEntryTime < fromDate) {
                return
            }

            if (timeEntryTime > toDate) {
                return
            }

            cachedTimeEntries[key].forEach(cacheEntry => {
                output.push(cacheEntry['data'])
            })
        })

        return output
    }

    toDateString(date) {
        return date.toISOString().slice(0, 10)
    }
}

module.exports = ClockifyCacheDecorator;
