// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
// Configuration //
/**
 * The value can either be 'true' or 'false'.
 *
 * Set the value to 'true' if you want to exclude time entries for the current day from the calculation.
 * Set the value to 'false' if you want to include time data for the current day.
 *  However, time entries that are currently running will still not be included in the calculation.
 */
const EXCLUDE_CURRENT_DAY_FROM_CALCULATION = true

/**
 * The value must be a number between 1 and 23.
 *
 * Set this value, so it reflects your daily working hours.
 * It is essential for the overtime calculation as it's used to
 *  calculate your expected working time which is then compared to your actual working time.
 */
const WORKING_HOURS_A_DAY = 6

/**
 * The value must be a number greater than 2000 or NULL if this functionality should be disabled.
 *
 * This value is used to exclude time entries that were added before the January 1st of the added year.
 * Set this value to NULL if you don't want to have this feature enabled and include all the values in your account.
 */
const CALCULATE_OVERTIME_SINCE = 2021

// TODO: Load configuration values from local env file
class Environment {
    getAPIKey() {
        const apiKey = args.widgetParameter
        if (apiKey !== null && apiKey instanceof String && apiKey.length > 0) {
            return apiKey
        }

        return 'X/cgd1W6iTzZvEG8' // TODO: Remove hardcoded key

        return null
    }

    getDailyWorkingHours() {
        if (WORKING_HOURS_A_DAY < 1 || WORKING_HOURS_A_DAY > 23) {
            throw "Invalid daily working hours value. Please set a value between 1 and 23."
        }

        return WORKING_HOURS_A_DAY
    }

    getExcludeCurrentDayFromStatistics() {
        if (EXCLUDE_CURRENT_DAY_FROM_CALCULATION !== true && EXCLUDE_CURRENT_DAY_FROM_CALCULATION !== false) {
            throw "Invalid value for EXCLUDE_CURRENT_DAY_FROM_CALCULATION. Please set it to either 'true' or 'false'."
        }

        return EXCLUDE_CURRENT_DAY_FROM_CALCULATION
    }

    getCalculateWorkingTimeSince() {
        if (CALCULATE_OVERTIME_SINCE instanceof Number && CALCULATE_OVERTIME_SINCE < 2000) {
            throw "Invalid value for CALCULATE_OVERTIME_SINCE. Please set it to a value greater than 2000 or NULL."
        }

        if (CALCULATE_OVERTIME_SINCE === null) {
            return 2000
        }

        return CALCULATE_OVERTIME_SINCE// TODO: Can I make this check implicit and stop fetching data if the API doesn't return things anymore? How can I determine if nothing is to come anymore? Could be that the user stopped using the program for a couple of weeks/months.
    }
}

module.exports = Environment
