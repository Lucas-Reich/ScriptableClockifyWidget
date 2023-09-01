// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;

class CacheEntry {
    constructor(createdAt, data) {
        this.createdAt = createdAt
        this.data = data
    }

    getYear() {
        const startDate = new Date(this.data.timeInterval.start)

        return startDate.getFullYear()
    }

    toJSON() {
        return {
            'createdAt': this.createdAt.toISOString().slice(0,10),
            'data': this.data
        }
    }
}

module.exports = CacheEntry;
