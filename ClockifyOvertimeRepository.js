// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
const Cache = importModule('Cache');
const ClockifyAPI = importModule('ClockifyAPI');
const ClockifyCacheDecorator = importModule('ClockifyCacheDecorator')

const CACHE_NAME = "ClockifyOvertimeWidget";
const CACHE_SHORT_TERM_DATA_EXPIRATION_HOURS = 24; // Once a day
const CACHE_MEDIUM_TERM_DATA_EXPIRATION_HOURS = 7 * 24; // Once a week
const CACHE_LONG_TERM_DATA_EXPIRATION = null; // Once

const CACHE_DATA_USER_ID = 'user_id';
const CACHE_DATA_USER_WORKSPACE = 'user_workspace'
const CACHE_DATA_OVERTIME_BY_YEAR = 'overtime_by_year'

class ClockifyOvertimeRepository {
    constructor(apiKey) {
        this.clockifyAPI = new ClockifyAPI(apiKey)
        this.cache = new Cache(CACHE_NAME)
        this.clockifyCache = new ClockifyCacheDecorator(this.cache)
    }

    async getOvertimeForDay(date) {
        return await this.getClockifyTimeInformation(date, date)
    }

    async getOvertimeForYear(year) {
        let cachedWorkingTime = await this.cache.read(CACHE_DATA_OVERTIME_BY_YEAR, CACHE_SHORT_TERM_DATA_EXPIRATION_HOURS)
        if (cachedWorkingTime !== null && cachedWorkingTime[year] !== undefined) return cachedWorkingTime[year]

        const timeData = await this.getClockifyTimeInformation(`${year}-01-01`, `${year}-12-31`)

        cachedWorkingTime[year] = timeData
        this.cache.write(CACHE_DATA_OVERTIME_BY_YEAR, cachedWorkingTime)

        return timeData
    }

    async getOvertimeForYear2(year) {
        const clockifyCacheResult = await this.clockifyCache.retrieveTimeEntries(`${year}-01-01`, `${year}-12-31`)
        // Check if result is only partial result
        const isPartialResult = true
        if (!isPartialResult) {
            return clockifyCacheResult
        }

        // fetch missing data
        const result = clockifyCacheResult[clockifyCacheResult.length - 1]
        const date = new Date(result['timeInterval']['start']).toISOString().slice(0, 10)
        const timeData = await this.getClockifyTimeInformation(date, `${year}-12-31`)

        this.cache.write(CACHE_DATA_OVERTIME_BY_YEAR, timeData)
        await this.clockifyCache.cacheTimeEntries(timeData) // TODO: Can I also not wait for this function to conclude

        clockifyCacheResult.push(timeData)
        return clockifyCacheResult
    }

    async getClockifyTimeInformation(dateRangeStart, dateRangeEnd) {
        const userId = await this.getUserId()
        const workspaceId = await this.getWorkspaceId()

        return await this.clockifyAPI.getTimeEntriesForDateRange(userId, workspaceId, dateRangeStart, dateRangeEnd)
    }

    async getClockifyTimeInformationWithCacheTime(dateRangeStart, dateRangeEnd, cacheExpiryTime) {
        const userId = await this.getUserId()
        const workspaceId = await this.getWorkspaceId()

        return await this.clockifyAPI.getTimeEntriesForDateRange(userId, workspaceId, dateRangeStart, dateRangeEnd)
    }

    async getWorkspaceId() {
        const cachedUserWorkspace = await this.cache.read(CACHE_DATA_USER_WORKSPACE, CACHE_SHORT_TERM_DATA_EXPIRATION_HOURS);
        if (cachedUserWorkspace) return cachedUserWorkspace;

        const workspaceId = await this.clockifyAPI.getWorkspaceId()
        this.cache.write(CACHE_DATA_USER_WORKSPACE, workspaceId);

        return workspaceId
    }

    async getUserId() {
        const cachedUserId = await this.cache.read(CACHE_DATA_USER_ID, CACHE_SHORT_TERM_DATA_EXPIRATION_HOURS);
        if (cachedUserId) return cachedUserId;

        const userId = await this.clockifyAPI.getUserId()
        this.cache.write(CACHE_DATA_USER_ID, userId);

        return userId
    }
}

module.exports = ClockifyOvertimeRepository;
