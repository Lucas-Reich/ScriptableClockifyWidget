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

    /**
     * @param {string} key
     * @returns {Promise<CacheEntryCollection>}
     */
    async read(key) {
        const path = this.fm.joinPath(this.cachePath, key)
        if (!this.fm.fileExists(path)) {
            return new CacheEntryCollection()
        }

        const value = this.fm.readString(path)
        if (null == value) {
            return new CacheEntryCollection()
        }

        return CacheEntryCollection.fromCache(JSON.parse(value))
    }

    write(key, cacheEntryCollection) {
        const path = this.fm.joinPath(this.cachePath, key.replace('/', "-"))
        console.log(`Caching to ${path} ...`)

        this.fm.writeString(path, cacheEntryCollection.toJSON())
    }
}

module.exports = Cache;
