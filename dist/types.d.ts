export interface PesapalConfig {
    consumerKey: string;
    consumerSecret: string;
    apiBaseUrl: string;
}
export interface AuthResponse {
    token: string;
    expiryDate: string;
}
export interface IPNRegistrationRequest {
    url: string;
    ipn_notification_type: 'GET' | 'POST';
}
export interface IPNRegistrationResponse {
    ipn_id: string;
    url: string;
}
export interface PaymentRequest {
    id: string;
    currency: string;
    amount: number;
    description: string;
    callback_url: string;
    notification_id: string;
    billing_address: {
        email_address?: string;
        phone_number?: string;
        first_name?: string;
        last_name?: string;
    };
}
export interface PaymentResponse {
    order_tracking_id: string;
    merchant_reference: string;
    redirect_url: string;
    status: string;
    error: number | null;
}
export interface TransactionStatusResponse {
    status: string;
    payment_method: string;
    amount: number;
    currency: string;
}
