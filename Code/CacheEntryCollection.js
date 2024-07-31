// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
const CacheEntry = importModule('CacheEntry')

class CacheEntryCollection {
    constructor() {
        this.collection = []
    }

    static fromCache(json) {
        const cacheCollection = new CacheEntryCollection()

        json.forEach(cacheEntry => {
            cacheCollection.add(new CacheEntry(
                new Date(cacheEntry.createdAt),
                cacheEntry.data
            ))
        })

        return cacheCollection
    }

    /**
     * @param data
     * @returns {CacheEntryCollection}
     */
    static fromSingle(data) {
        const cacheCollection = new CacheEntryCollection()

        cacheCollection.add(new CacheEntry(
            new Date(),
            JSON.stringify(data)
        ))

        return cacheCollection
    }

    /**
     * @param {CacheEntry} cacheEntry
     * @returns void
     */
    add(cacheEntry) {
        this.collection.push(cacheEntry)
    }

    /**
     * @param {TimeEntryCollection} timeEntries
     */
    addTimeEntries(timeEntries) {
        timeEntries.toJSON().forEach(timeEntry => {
            this.add(new CacheEntry(
                new Date(),
                timeEntry
            ))
        })
    }

    upsert(other) {
        const copy = this.collection

        other.forEach(otherTimeEntry => {
            const insertIndex = 0; // TODO: Get insertIndex
            copy[insertIndex] = otherTimeEntry
        })

        return copy;
    }

    /**
     * @param {int} year
     * @returns {CacheEntry[]}
     */
    getEntriesForYear(year) { // TODO: Should probably not do this in here
        const output = []

        this.collection.forEach(cacheEntry => {
            if (cacheEntry.getYear() === year) {
                output.push(cacheEntry)
            }
        })

        return output
    }

    toJSON() {
        let output = []

        this.collection.forEach(cacheEntry => {
            output.push(cacheEntry.toJSON())
        })

        return JSON.stringify(output)
    }
}

module.exports = CacheEntryCollection;
