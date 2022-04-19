// @flow

import { CALL_INTEGRATION_ENABLED, getFeatureFlag } from '../../base/flags';
import { toState } from '../../base/redux';

/**
 * Checks if call integration is enabled or not.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {string} - Default URL for the app.
 */
export function isCallIntegrationEnabled(stateful: Function | Object) {
    const state = toState(stateful);
    //const { disableCallIntegration } = state['features/base/flags'];
    //console.error(flag, disableCallIntegration);
    // The feature flag has precedence.
    return true;
}

export function getCallUUID(stateful: Function | Object) {
    const state = toState(stateful);
    const { callUUID } = state['features/base/flags'];
    // The feature flag has precedence.
    return callUUID;
}
