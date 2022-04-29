// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api/v1'

class ClockifyAPI {
    constructor(apiKey) {
        this.apiKey = apiKey
    }

    async getWorkspaceId() {
        const request = new Request(`${CLOCKIFY_BASE_URL}/workspaces`)
        request.headers = {
            'Content-Type': 'application/json',
            'X-Api-key': this.apiKey
        }

        const workspace = await request.loadJSON()
        if (request.response.statusCode === 401) {
            console.log(request.response)
            throw "InvalidAPIKeyException"
        }
        if (request.response.statusCode !== 200) {
            console.log(request.response)
            throw "InvalidClockifyResponse"
        }
        return workspace[0].id
    }

    async getUserId() {
        const request = new Request(`${CLOCKIFY_BASE_URL}/user`)
        request.headers = {
            'Content-Type': 'application/json',
            'X-Api-key': this.apiKey
        }

        const user = await request.loadJSON()
        if (request.response.statusCode === 401) {
            console.log(request.response)
            throw "InvalidAPIKeyException"
        }
        if (request.response.statusCode !== 200) {
            console.log(request.response)
            throw "InvalidClockifyResponse"
        }
        return user.id
    }

    async getTimeEntriesForYear(userId, workspaceId, year) {
        const start = `${year}-01-01T00:00:01Z`
        const end = `${year}-12-31T23:59:59Z`

        const request = new Request(`${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/user/${userId}/time-entries?page-size=1000&start=${start}&end=${end}`)
        request.headers = {
            'Content-Type': 'application/json',
            'X-Api-key': this.apiKey
        }

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
}

module.exports = ClockifyAPI;
