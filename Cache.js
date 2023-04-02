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

    async read(key) {
        try {
            const path = this.fm.joinPath(this.cachePath, key)
            const value = this.fm.readString(path)

            try {
                if (null == value) {
                    return null
                }

                return CacheEntryCollection.fromCache(JSON.parse(value))
            } catch (error) {
                return value
            }
        } catch (error) {
            return null
        }
    }

    write(key, cacheEntryCollection) {
        const path = this.fm.joinPath(this.cachePath, key.replace('/', "-"))
        console.log(`Caching to ${path} ...`)

        this.fm.writeString(path, cacheEntryCollection.toJSON())
    }
}

module.exports = Cache;
