// src/pesapal.ts
import ky, { KyInstance } from 'ky';
import { PesapalConfig, AuthResponse, IPNRegistrationRequest, IPNRegistrationResponse, PaymentRequest, PaymentResponse, TransactionStatusResponse } from './types';

export class Pesapal {
  private config: PesapalConfig;
  private kyInstance: KyInstance;

  constructor(config: PesapalConfig) {
    this.config = config;
    this.kyInstance = ky.create({
      prefixUrl: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async getAuthToken(): Promise<string> {
    const response = await this.kyInstance.post('Auth/RequestToken', {
      json: {
        consumer_key: this.config.consumerKey,
        consumer_secret: this.config.consumerSecret,
      },
    }).json<AuthResponse>();
    return response.token;
  }

  public async registerIPN(data: IPNRegistrationRequest): Promise<IPNRegistrationResponse> {
    const token = await this.getAuthToken();
    const response = await this.kyInstance.post('URLSetup/RegisterIPN', {
      json: data,
      headers: { Authorization: `Bearer ${token}` },
    }).json<IPNRegistrationResponse>();
    return response;
  }

  public async submitOrder(data: PaymentRequest): Promise<PaymentResponse> {
    if (!data.id || !data.currency || !data.amount || !data.description || !data.callback_url || !data.notification_id) {
      throw new Error('Missing required payment request data.');
    }

    if (typeof data.amount !== 'number' || data.amount <= 0) {
      throw new Error('Invalid amount.');
    }

    const token = await this.getAuthToken();
    const response = await this.kyInstance.post('Transactions/SubmitOrderRequest', {
      json: data,
      headers: { Authorization: `Bearer ${token}` },
    }).json<PaymentResponse>();
    return response;
  }

  public async getTransactionStatus(orderTrackingId: string): Promise<TransactionStatusResponse> {
    const token = await this.getAuthToken();
    const response = await this.kyInstance.get(`Transactions/GetTransactionStatus`, {
      searchParams: { orderTrackingId },
      headers: { Authorization: `Bearer ${token}` },
    }).json<TransactionStatusResponse>();
    return response;
  }
}