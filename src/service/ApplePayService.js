import {
    PaymentRequest,
} from 'react-native-payments';
import {apple_merchant} from '../../app.json';
const ApplePayService = (data) => {
    const METHOD_DATA = [
        {
            supportedMethods: ['apple-pay'],
            data: {
                merchantIdentifier: apple_merchant,
                supportedNetworks: ['visa', 'mastercard', 'amex'],
                countryCode: 'GB',
                currencyCode: 'GBP',
            },
        },
    ];
    const DETAILS = {
        id: 'purchase',
        displayItems: [
        {
            label: 'Lottery Top Up',
            amount: {
            currency: 'GBP',
            value: data.amount,
            },
        },
        ],
        total: {
        label: 'Lottery Top Up',
        amount: {
            currency: 'GBP',
            value: data.amount,
        },
        },
    };

    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
    return paymentRequest;
};
export default ApplePayService;
