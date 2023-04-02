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
                // cacheEntry.createdAt, -- todo: Temp disabled
                new Date(),
                cacheEntry.data
            ))
        })

        return cacheCollection
    }

    static fromCollection(collection) {
        const cacheCollection = new CacheEntryCollection()

        collection.toJSON().forEach(collectionEntry => {
            cacheCollection.add(new CacheEntry(
                new Date(),
                collectionEntry
            ))
        })

        return cacheCollection
    }

    static fromSingle(data) {
        const cacheCollection = new CacheEntryCollection()

        cacheCollection.add(new CacheEntry(
            new Date(),
            JSON.stringify(data)
        ))

        return cacheCollection
    }

    add(cacheEntry) {
        this.collection.push(cacheEntry)
    }

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
