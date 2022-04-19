//import { authorize } from 'react-native-app-auth';
//import { oauth } from '../../app.json';
import { Buffer } from 'buffer';
const OAuth = async provider => {
    try {
        //const authState = await authorize(oauth[provider]);
        const authState = {};
        if (authState.idToken) {
            const jwtBody = authState.idToken.split('.')[1];
            const base64 = jwtBody.replace('-', '+').replace('_', '/');
            const decodedJwt = Buffer.from(base64, 'base64');
            authState.idTokenJSON = JSON.parse(decodedJwt);
            return authState;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export default OAuth;
