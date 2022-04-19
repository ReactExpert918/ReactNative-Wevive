import CryptoJS from 'crypto-js';
import {debug, ecom_callback_url, ecom_url,ecom_merchant_id,ecom_merchant,ecom_website,ecom_signature,ecom_3ds_term,ecom_3ds_redirect} from './../../app.json';
import CacheStore from 'react-native-cache-store';
import {parse_str,urlencode} from '../utils/helpers';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ECOMService = async (data) => {
  let params = {};
  params.customerEmail = await AsyncStorage.getItem('email');
  params.customerReceiptsRequired = "Y";
  params.merchantID = ecom_merchant_id;
  params.action = 'SALE';
  params.amount = Math.round(data.amount * 100);
  params.type = 1;
  params.avscv2CheckRequired = 'N';
  params.countryCode = 826;
  params.currencyCode = 826;
  if (data.number) {
    params.cardNumber = data.number.replace(/ /g, '');
    params.cardCVV = data.cvc;
    params.transactionUnique = uuidv4();
    if (params.cardNumber === '4111111111111111') {
      if (ecom_merchant_id === '103238') {
        params.cardNumber = '4012010000000000009';
      } else {
        params.cardNumber = '4929421234600821';
        params.cardCVV = '356';
      }
    }
    params.cardExpiryDate = data.expiry.replace(/\//g,'');
  } else {
    params.paymentMethod = 'applepay';
    params.paymentToken = data.token;
  }
  params.callbackURL = ecom_callback_url;
  params.merchantName = ecom_merchant;
  params.merchantWebsite = ecom_website;
  const ordered_params = [];
  Object.keys(params).sort().forEach(function(key) {
    ordered_params[key] = params[key];
  });
  const params_string = urlencode(ordered_params) + ecom_signature;
  params.signature = await CryptoJS.SHA512(params_string).toString(CryptoJS.enc.Hex);
  let formdata = new FormData();
  Object.keys(params).sort().forEach(function (key) {
    formdata.append(key,params[key]);
  });
  const fetchFromECOM = (url, params) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
    .then((response) => response.text())
    .then((responseText) => parse_str(responseText))
    .then((responseObject) => {
      if (responseObject.responseCode === 0) {
        //SUCCESS
      } else if (responseObject.responseCode === '65802') {
        let params3DS = [];
        params3DS.URL = responseObject.threeDSACSURL;
        params3DS.MD = responseObject.threeDSMD;
        params3DS.PaReq = responseObject.threeDSPaReq;
        params3DS.TermUrl = ecom_3ds_term;
        responseObject.url = ecom_3ds_redirect + '?' + urlencode(params3DS);
      }
      return responseObject;
    }).catch((error) => {
      if (debug) {console.error(error);}
    });
  };
  return fetchFromECOM(ecom_url,params);
};

export default ECOMService;
