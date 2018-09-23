export const constants = {
    paginationLimit: 50,
};

export const modelCounter = {
    loginInfo: 'loginInfoId',
    user: 'userId',
    traveller: 'travellerId',
    merchant: 'merchantId',
    wallet: 'walletId',
    transaction: 'transactionId',
    checkInLog: 'checkInLogId',
};

export const POINT_VALUE = 10;
export const DEFAULT_PERCENTAGE = 10;
export const DEFAULT_KILOMETER = 10;
export const POINT_RATIO = 1; // for every 1$;
export const AMOUNT_RATIO = 1; // for every 1$;

export const CURRENCY = {
    name: 'Dollar',
    char: '$',
    html: '&#36;',
};

export const PAYMENT_STATUS_CODES = {
    paystackSuccess: 200,
    paystackFailed: 400,
    remitaSuccess: '00',
    remitaFailed: '01',
};