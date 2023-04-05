// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
const TimeEntryCollection = importModule('TimeEntryCollection');

const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api/v1'

class ClockifyAPI {
    constructor(apiKey) {
        this.apiKey = apiKey
    }

    async getWorkspaceId() {
        const request = this.buildRequest('workspaces')

        return (await this.fetchData(request))[0].id
    }

    async getUserId() {
        const request = this.buildRequest('user')

        return (await this.fetchData(request)).id
    }

    /**
     * @returns {Promise<TimeEntryCollection>}
     */
    async getTimeEntriesForDateRange(userId, workspaceId, dateRangeStart, dateRangeEnd) {
        const start = `${dateRangeStart}T00:00:01Z`
        const end = `${dateRangeEnd}T23:59:59Z`

        const request = this.buildRequest(`workspaces/${workspaceId}/user/${userId}/time-entries?page-size=1000&start=${start}&end=${end}`)
        const data = await this.fetchData(request)

        return new TimeEntryCollection(data)
    }

    async fetchData(request) {
        const response = await request.loadJSON()
        if (request.response.statusCode === 401) {
            console.log(request.response)
            throw "InvalidAPIKeyException"
        }
        if (request.response.statusCode !== 200) {
            console.log(request.response)
            throw "InvalidClockifyResponse"
        }

        return response
    }

    buildRequest(url) {
        const request = new Request(`${CLOCKIFY_BASE_URL}/${url}`)
        request.headers = {
            'Content-Type': 'application/json',
            'X-Api-key': this.apiKey
        }

        return request
    }
}

module.exports = ClockifyAPI;
