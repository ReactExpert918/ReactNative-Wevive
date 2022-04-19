import CryptoJS from 'crypto-js';
import {debug, api_url, api_hmac_secret, public_key} from './../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from 'react-native-cookies';
import {Buffer} from 'buffer';

import CacheStore from 'react-native-cache-store';

const decodejwt = function (token) {
  const jwtBody = token.split('.')[1];
  const base64 = jwtBody.replace('-', '+').replace('_', '/');
  const decodedJwt = Buffer.from(base64, 'base64');
  const decodedJSON = JSON.parse(decodedJwt);
  return decodedJSON;
};

const APIService = async (endpoint, data, cache_time, forceToken) => {
  //var cache_time = 0;
  let json_data = JSON.stringify(data);
  var hmac = await CryptoJS.HmacSHA256(
    api_url + endpoint + json_data,
    api_hmac_secret,
  );
  CookieManager.clearAll();
  const fetchFromAPI = (url, requestData, hmac, userToken) => {
    if (requestData == 'null') {
      requestData = null;
    }
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (userToken) {
      headers = {...headers, Authorization: 'Bearer ' + userToken};
    }
    var method = requestData ? 'POST' : 'GET';
    if (
      url.indexOf('user-photo/update_photo/') > 0 ||
      url.indexOf('groups/') > 0
    ) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    if (url.indexOf('users/me/') > 0 && method === 'POST') {
      method = 'PUT';
    }
    if (url.indexOf('users/geoip/') > 0) {
      delete headers.Authorization;
    }
    if (url.indexOf('users/password_update/') > 0 && method === 'POST') {
      method = 'PUT';
    }
    if (url.indexOf('users/email_update/') > 0 && method === 'POST') {
      method = 'PUT';
    }
    const options = {
      method,
      headers,
    };
    if (headers['Content-Type'] === 'multipart/form-data') {
      const formData = new FormData();
      if (data.photo && data.mime && data.filename) {
        formData.append('photo', {
          uri: data.photo,
          type: data.mime,
          name: data.filename,
        });
      }
      if (data.group_photo && data.mime && data.filename) {
        formData.append('group_photo', {
          uri: data.group_photo,
          type: data.mime,
          name: data.filename,
        });
        formData.append('name', data.name);
      }
      options.body = formData;
    } else {
      options.body = requestData;
    }
    return fetch(url, options)
      .then((response) => {
        if (headers['Content-Type'] === 'multipart/form-data') {
          return response.text();
        } else {
          return response.json();
        }
      })
      .then((responseJson) => {
        if (cache_time !== undefined && cache_time > 0) {
          CacheStore.set(url + '_' + hmac, responseJson, cache_time);
        }
        return responseJson;
      })
      .catch((error) => {
        //if (debug) {
          //Log and send to backend later?
          console.log('APIService Error', url, options, error);
        //}
      });
  };
  const tokens = await AsyncStorage.multiGet(['userToken', 'refreshToken']);
  const userToken = tokens[0][0] === 'userToken' ? tokens[0][1] : tokens[1][1];
  const refreshToken =
    tokens[0][0] === 'userToken' ? tokens[1][1] : tokens[0][1];
  //const jwt = userToken ? decodejwt(userToken) : {};
  //const jwtR = refreshToken ? decodejwt(refreshToken) : {};
  if (cache_time !== undefined && cache_time > 0) {
    return new Promise((resolve) => {
      CacheStore.get(api_url + endpoint + '_' + hmac).then(
        async (cached_response) => {
          if (cached_response !== null) {
            resolve(cached_response);
          } else {
            const result = userToken
              ? await fetchFromAPI(
                  api_url + endpoint,
                  json_data,
                  hmac,
                  userToken,
                )
              : await fetchFromAPI(api_url + endpoint, json_data, hmac);
            resolve(result);
          }
        },
      );
    });
  } else {
    if (userToken) {
      return new Promise(async (resolve, reject) => {
        const result = userToken
          ? await fetchFromAPI(api_url + endpoint, json_data, hmac, userToken)
          : await fetchFromAPI(api_url + endpoint, json_data, hmac);
        if (userToken && result && result.code === 'token_not_valid') {
          const refreshedToken = await fetchFromAPI(
            api_url + 'token/refresh/',
            JSON.stringify({refresh: refreshToken}),
            hmac,
          );
          if (refreshedToken && refreshedToken.access) {
            AsyncStorage.setItem('userToken', refreshedToken.access);
            AsyncStorage.setItem('refreshToken', refreshedToken.refresh);
            const newResult = await fetchFromAPI(
              api_url + endpoint,
              json_data,
              hmac,
              refreshedToken.access,
            );
            resolve(newResult);
          } else if (userToken) {
            AsyncStorage.removeItem('userToken');
            reject('no_key');
          }
        }
        resolve(result);
      });
    } else {
      const result = fetchFromAPI(
        api_url + endpoint,
        json_data,
        hmac,
        forceToken,
      );
      return result;
    }
  }
};

export default APIService;
