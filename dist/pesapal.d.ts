import { PesapalConfig, IPNRegistrationRequest, IPNRegistrationResponse, PaymentRequest, PaymentResponse, TransactionStatusResponse } from './types';
export declare class Pesapal {
    private config;
    private axiosInstance;
    constructor(config: PesapalConfig);
    getAuthToken(): Promise<string>;
    registerIPN(data: IPNRegistrationRequest): Promise<IPNRegistrationResponse>;
    submitOrder(data: PaymentRequest): Promise<PaymentResponse>;
    getTransactionStatus(orderTrackingId: string): Promise<TransactionStatusResponse>;
}
