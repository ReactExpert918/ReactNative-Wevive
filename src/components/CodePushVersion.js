//import codePush from "react-native-code-push";
import {
    getVersion,
    getBuildNumber,
    getSystemName,
    getSystemVersion,
    getDeviceType
} from "react-native-device-info";

//const createUserAgent = () => `Seek/${getVersion()} ${getDeviceType()} (Build ${getBuildNumber()}) ${getSystemName()}/${getSystemVersion()}`;

async function getAppVersion() {
    /*codePush.sync({ updateDialog: false, installMode: codePush.InstallMode.ON_NEXT_RESUME });
    const [{ appVersion }, update] = await Promise.all([
        codePush.getConfiguration(),
        codePush.getUpdateMetadata()
    ]);

    if (!update) {
        return `v${appVersion}`;
    }

    const label = update.label.substring(1);
    return `v${appVersion} rev.${label}`;
    */
    return `${getVersion()} (${getBuildNumber()})`;
};

export { getAppVersion };