// src/pesapal.ts
import { createAxiosInstance } from './utils/axios';
import { PesapalConfig, AuthResponse, IPNRegistrationRequest, IPNRegistrationResponse, PaymentRequest, PaymentResponse, TransactionStatusResponse } from './types';

export class Pesapal {
  private config: PesapalConfig;
  private axiosInstance: ReturnType<typeof createAxiosInstance>;

  constructor(config: PesapalConfig) {
    this.config = config;
    this.axiosInstance = createAxiosInstance(config);
  }

  public async getAuthToken(): Promise<string> {
    const response = await this.axiosInstance.post<AuthResponse>('/Auth/RequestToken', {
      consumer_key: this.config.consumerKey,
      consumer_secret: this.config.consumerSecret,
    });
    return response.data.token;
  }

  public async registerIPN(data: IPNRegistrationRequest): Promise<IPNRegistrationResponse> {
    const token = await this.getAuthToken();
    const response = await this.axiosInstance.post<IPNRegistrationResponse>(
      '/URLSetup/RegisterIPN',
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  public async submitOrder(data: PaymentRequest): Promise<PaymentResponse> {
    if (!data.id || !data.currency || !data.amount || !data.description || !data.callback_url || !data.notification_id) {
      throw new Error('Missing required payment request data.');
    }

    if (typeof data.amount !== 'number' || data.amount <= 0) {
      throw new Error('Invalid amount.');
    }

    const token = await this.getAuthToken();
    const response = await this.axiosInstance.post<PaymentResponse>(
      '/Transactions/SubmitOrderRequest',
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  public async getTransactionStatus(orderTrackingId: string): Promise<TransactionStatusResponse> {
    const token = await this.getAuthToken();
    const response = await this.axiosInstance.get<TransactionStatusResponse>(
      `/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}