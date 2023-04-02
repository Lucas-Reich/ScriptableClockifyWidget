// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;
const CacheEntryCollection = importModule('CacheEntryCollection')

class Cache {
    constructor(name) {
        this.fm = FileManager.local();
        this.cachePath = this.fm.joinPath(this.fm.documentsDirectory(), name);

        if (!this.fm.fileExists(this.cachePath)) {
            this.fm.createDirectory(this.cachePath);
        }
    }

    read = async (key, expirationHours) => {
        try {
            const path = this.fm.joinPath(this.cachePath, key);
            const createdAt = this.fm.creationDate(path);

            if (expirationHours) {
                if ((new Date()) - createdAt > (expirationHours * 3_600_000)) {
                    this.fm.remove(path);
                    return null;
                }
            }

            const value = this.fm.readString(path);

            try {
                if (null == value) {
                    return null
                }

                return JSON.parse(value);
            } catch (error) {
                return value;
            }
        } catch (error) {
            return null;
        }
    }

    async read2(key) {
        try {
            const path = this.fm.joinPath(this.cachePath, key)
            const value = this.fm.readString(path)

            try {
                if (null == value) {
                    return null
                }

                const rawData = JSON.parse(value)
                const rawData2 = []

                // I need to do this in order to extract the data out of the year
                for (let year in rawData) {
                    rawData2.push(rawData[year])
                }

                return CacheEntryCollection.fromCache(rawData2)
            } catch (error) {
                return value
            }
        } catch (error) {
            return null
        }
    }

    write = (key, value) => {
        const path = this.fm.joinPath(this.cachePath, key.replace('/', "-"));
        console.log(`Caching to ${path}...`);

        if (typeof value === "string" || value instanceof String) {
            this.fm.writeString(path, value);
        } else {
            this.fm.writeString(path, JSON.stringify(value));
        }
    }

    write2(key, cacheEntryCollection) {
        const path = this.fm.joinPath(this.cachePath, key.replace('/', "-"))
        console.log(`Caching to ${path} ...`)

        this.fm.writeString(path, cacheEntryCollection.toJSON())
    }
}

module.exports = Cache;
