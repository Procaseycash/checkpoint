import {generateKey} from "./utils";
import {PaymentMethodEnum} from "../enums/payment.method.enum";

export class MockPayment {
    static get defaultPaymentMethod() {
        return this._defaultPaymentMethod;
    }

    static set defaultPaymentMethod(value) {
        this._defaultPaymentMethod = value;
    }

    private static _defaultPaymentMethod;

    public static async pay(payload: PaymentPayload) {
        return await ((MockPayment.defaultPaymentMethod === PaymentMethodEnum.PAYSTACK) ? MockPayment.payWithPayStack(payload) : MockPayment.payWithRemita(payload));
    }

    private static async payWithPayStack(payload) {
        return {status_code: 200, status_message: 'PAID', payment_reference: generateKey()};
    }

    private static async payWithRemita(payload) {
        return {status_code: '00', status_message: 'PAID', payment_reference: generateKey()};
    }
}

interface PaymentPayload {
    amount: number;
    account_no: string;
    bank_code: string;
    bank_name: string;
    transaction_reference: string;
    account_name: string;
}