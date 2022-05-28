// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
const Cache = importModule('Cache');
const ClockifyAPI = importModule('ClockifyAPI');

const CACHE_NAME = "ClockifyOvertimeWidget";
const CACHE_EXPIRATION_HOURS = 24;
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
    }

    async getOvertimeForYear(year) {
        let cachedWorkingTime = await this.cache.read(CACHE_DATA_OVERTIME_BY_YEAR, CACHE_EXPIRATION_HOURS)
        if (cachedWorkingTime !== null && cachedWorkingTime[year] !== undefined) return cachedWorkingTime[year]

        const userId = await this.clockifyAPI.getUserId()
        const workspaceId = await this.clockifyAPI.getWorkspaceId()

        let timeReq = await this.clockifyAPI.getTimeEntriesForYear(userId, workspaceId, year)
        const timeData = await timeReq

        if (null === cachedWorkingTime) {
            cachedWorkingTime = {}
        }
        cachedWorkingTime[year] = timeData
        this.cache.write(CACHE_DATA_OVERTIME_BY_YEAR, cachedWorkingTime)

        return timeData
    }

    async getWorkspaceId() {
        const cachedUserWorkspace = await this.cache.read(CACHE_DATA_USER_WORKSPACE, CACHE_EXPIRATION_HOURS);
        if (cachedUserWorkspace) return cachedUserWorkspace;

        const workspaceId = this.clockifyAPI.getWorkspaceId()
        this.cache.write(CACHE_DATA_USER_WORKSPACE, workspaceId);

        return workspaceId
    }

    async getUserId() {
        const cachedUserId = await this.cache.read(CACHE_DATA_USER_ID, CACHE_EXPIRATION_HOURS);
        if (cachedUserId) return cachedUserId;

        const userId = this.clockifyAPI.getUserId()
        this.cache.write(CACHE_DATA_USER_ID, userId.id);

        return userId
    }
}

module.exports = ClockifyOvertimeRepository;
