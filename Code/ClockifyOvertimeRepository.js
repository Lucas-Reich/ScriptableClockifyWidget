// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
const Cache = importModule('Cache');
const ClockifyAPI = importModule('ClockifyAPI');
const CacheEntryCollection = importModule('CacheEntryCollection')
const TimeEntryCollection = importModule('TimeEntryCollection')

// entries older than 1 month should not be updated
// entries with age between < 1 month and > 1 week should be refreshed weekly
// entries with age between < 1 week and > 1 day should be refreshed daily
// entries with age < 1 day should be always refreshed

// would it make sense to add an expiry date to time entries. -- todo: maybe it also makes sense to put those values into different files (1 file for weekly update, 1 file for daily update, and 1 file for always update)
// whenever the cache is read all the entries are read again. -- todo: I guess it would make sense to not always read all the entries again as the ones older than 1 month will not change anyway
// if expiry date <= current date then re-fetch those items -- todo: can I somehow batch those requests?
// whenever an item is fetched I check its time value and calculate the expiry time base on the rules above -- todo: I would need to make sure that the old entries are replaced with the new ones


const CACHE_NAME = "ClockifyOvertimeWidget";

const CACHE_DATA_USER_ID = 'user_id';
const CACHE_DATA_USER_WORKSPACE = 'user_workspace'
const CACHE_DATA_OVERTIME_BY_YEAR = 'overtime_by_year'

class ClockifyOvertimeRepository {
    constructor(apiKey) {
        this.clockifyAPI = new ClockifyAPI(apiKey)
        this.cache = new Cache(CACHE_NAME)
    }

    /**
     * @param {int} year
     * @returns {Promise<TimeEntryCollection>}
     */
    async getOvertimeForYear(year) {
        const cacheEntryCollection = await this.cache.read(CACHE_DATA_OVERTIME_BY_YEAR)
        const entries = cacheEntryCollection.getEntriesForYear(year)
        if (entries.length !== 0) return TimeEntryCollection.fromCacheCollection(entries)

        const timeEntryCollection = await this.fetchClockifyAPI(`${year}-01-01`, `${year}-12-31`)
        cacheEntryCollection.addTimeEntries(timeEntryCollection)

        this.cache.write(CACHE_DATA_OVERTIME_BY_YEAR, cacheEntryCollection)

        return timeEntryCollection
    }

    /**
     * @param {CacheEntryCollection} cacheEntryCollection
     *
     * @return {CacheEntryCollection}
     */
    refreshOutdatedItems(cacheEntryCollection) { // TODO: Use to update outdated items
        const outdatedItems = this.findOutdatedEntries(cacheEntryCollection)

        // todo: refresh outdated items
        //  group dates of outdated items as best as possible and send request to ClockifyAPI

        // todo: update items in list

        return cacheEntryCollection
    }

    /**
     * @param {CacheEntryCollection} cacheCollection
     */
    findOutdatedEntries(cacheCollection) {
        /**
         * @type {CacheEntry[]}
         */
        const outdatedEntries = []

        cacheCollection.collection.forEach(cacheEntry => {
            if (this.isOutdated(cacheEntry)) {
                outdatedEntries.push(cacheEntry)
            }
        })

        return outdatedEntries
    }

    /**
     * @param {CacheEntry} cacheEntry
     *
     * @return {boolean}
     */
    isOutdated(cacheEntry) {
        const createdXDaysAgo = Math.ceil((new Date() - cacheEntry.data.timeInterval.start) / (1000 * 3600 * 24))
        const ageInDays = Math.ceil((new Date() - cacheEntry.createdAt) / (1000 * 3600 * 24))

        if (createdXDaysAgo > 30) {
            return false
        }

        if (createdXDaysAgo > 7 && createdXDaysAgo <= 30) {
            return ageInDays >= 7
        }

        if (createdXDaysAgo > 1 && createdXDaysAgo <= 7) {
            return ageInDays >= 1
        }

        return true
    }

    /**
     * @returns {Promise<TimeEntryCollection>}
     */
    async fetchClockifyAPI(dateRangeStart, dateRangeEnd) {
        const userId = await this.getUserId()
        const workspaceId = await this.getWorkspaceId()

        return await this.clockifyAPI.getTimeEntriesForDateRange(userId, workspaceId, dateRangeStart, dateRangeEnd)
    }

    /**
     * @returns {Promise<string>}
     */
    async getWorkspaceId() {
        const cachedUserWorkspaceCollection = await this.cache.read(CACHE_DATA_USER_WORKSPACE);
        if (0 !== cachedUserWorkspaceCollection.collection.length) return JSON.parse(cachedUserWorkspaceCollection.collection.pop().data);

        const rawWorkspaceId = await this.clockifyAPI.getWorkspaceId()
        const cacheCollection = CacheEntryCollection.fromSingle(rawWorkspaceId)

        this.cache.write(CACHE_DATA_USER_WORKSPACE, cacheCollection);

        return JSON.parse(cacheCollection.collection.pop().data)
    }

    /**
     * @returns {Promise<string>}
     */
    async getUserId() {
        const cachedUserIdCollection = await this.cache.read(CACHE_DATA_USER_ID)
        if (0 !== cachedUserIdCollection.collection.length) return JSON.parse(cachedUserIdCollection.collection.pop().data);

        const rawUserId = await this.clockifyAPI.getUserId()
        const cacheCollection = CacheEntryCollection.fromSingle(rawUserId)

        this.cache.write(CACHE_DATA_USER_ID, cacheCollection);

        return JSON.parse(cacheCollection.collection.pop().data)
    }
}

module.exports = ClockifyOvertimeRepository;
