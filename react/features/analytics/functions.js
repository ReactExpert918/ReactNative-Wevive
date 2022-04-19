// @flow

/**
 * Sends an event through the lib-jitsi-meet AnalyticsAdapter interface.
 *
 * @param {Object} event - The event to send. It should be formatted as
 * described in AnalyticsAdapter.js in lib-jitsi-meet.
 * @returns {void}
 */
export function sendAnalytics(event: Object) {
    return false;
}

/**
 * Return saved amplitude identity info such as session id, device id and user id. We assume these do not change for
 * the duration of the conference.
 *
 * @returns {Object}
 */
export function getAmplitudeIdentity() {
    return;
}

/**
 * Resets the analytics adapter to its initial state - removes handlers, cache,
 * disabled state, etc.
 *
 * @returns {void}
 */
export function resetAnalytics() {
    return;
}

/**
 * Creates the analytics handlers.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @returns {Promise} Resolves with the handlers that have been successfully loaded.
 */
export async function createHandlers({ getState }: { getState: Function }) {
    return [];
}

/**
 * Inits JitsiMeetJS.analytics by setting permanent properties and setting the handlers from the loaded scripts.
 * NOTE: Has to be used after JitsiMeetJS.init. Otherwise analytics will be null.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @param {Array<Object>} handlers - The analytics handlers.
 * @returns {void}
 */
export function initAnalytics({ getState }: { getState: Function }, handlers: Array<Object>) {
    return;
}

/**
 * Checks whether we are loaded in iframe.
 *
 * @returns {boolean} Returns {@code true} if loaded in iframe.
 * @private
 */
function _inIframe() {
    if (navigator.product === 'ReactNative') {
        return false;
    }
}

/**
 * Tries to load the scripts for the external analytics handlers and creates them.
 *
 * @param {Array} scriptURLs - The array of script urls to load.
 * @param {Object} handlerConstructorOptions - The default options to pass when creating handlers.
 * @private
 * @returns {Promise} Resolves with the handlers that have been successfully loaded and rejects if there are no handlers
 * loaded or the analytics is disabled.
 */
function _loadHandlers(scriptURLs = [], handlerConstructorOptions) {
}
