import CryptoJS from 'crypto-js';
import {debug, ecom_callback_url, ecom_hosted_url, ecom_hosted_merchant_id,ecom_hosted_signature ,ecom_merchant,ecom_website,ecom_signature,ecom_3ds_term,ecom_3ds_redirect} from './../../app.json';
import CacheStore from 'react-native-cache-store';
import {parse_str,urlencode} from '../utils/helpers';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ECOMHostedService = async (data) => {
  let params = {};
  params.customerEmail = await AsyncStorage.getItem('email');
  params.customerReceiptsRequired = 'Y';
  params.merchantID = ecom_hosted_merchant_id;
  params.action = 'SALE';
  params.amount = Math.round(data.amount * 100);
  params.countryCode = 826;
  params.currencyCode = 826;
  params.transactionUnique = uuidv4();
  params.callbackURL = ecom_callback_url;
  params.merchantName = ecom_merchant;
  params.merchantWebsite = ecom_website;
  const ordered_params = [];
  Object.keys(params).sort().forEach(function(key) {
    ordered_params[key] = params[key];
  });
  const params_string = urlencode(ordered_params) + ecom_hosted_signature;
  params.signature = await CryptoJS.SHA512(params_string).toString(CryptoJS.enc.Hex);
  ordered_params.signature = params.signature;
  return ecom_hosted_url + '?' + urlencode(ordered_params);
};

export default ECOMHostedService;
