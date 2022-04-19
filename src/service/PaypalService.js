//import { requestOneTimePayment } from 'react-native-paypal';
import APIService from "./APIService";


const PaypalService = async (data) => {
  return true;
  //api_response = APIService("paypal",data);
  return requestOneTimePayment(
    api_response.token,
    {
      amount: data.amount, // required
      // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
      currency: 'GBP',
      // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
      localeCode: 'en_GB', 
      shippingAddressRequired: false,
      userAction: 'commit', // display 'Pay Now' on the PayPal review page
      // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
      intent: 'authorize', 
    }
  ).then((response) => {
    return response.nonce;
  })
  .catch((error) => {
    console.error(error);
    return false;
  });
}

export default PaypalService;
