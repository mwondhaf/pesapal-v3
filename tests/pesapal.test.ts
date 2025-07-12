
// tests/pesapal.test.ts
import { Pesapal } from '../src/pesapal';
import { PesapalConfig, AuthResponse, IPNRegistrationRequest, IPNRegistrationResponse, PaymentRequest, PaymentResponse, TransactionStatusResponse } from '../src/types';
import { createAxiosInstance } from '../src/utils/axios';

jest.mock('../src/utils/axios');

const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
};

(createAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

describe('Pesapal', () => {
  let pesapal: Pesapal;
  const config: PesapalConfig = {
    consumerKey: 'test_key',
    consumerSecret: 'test_secret',
    apiBaseUrl: 'https://cybqa.pesapal.com/pesapalv3/api',
  };

  beforeEach(() => {
    pesapal = new Pesapal(config);
    jest.clearAllMocks();
  });

  it('should throw an error if apiBaseUrl is not HTTPS', () => {
    const invalidConfig: PesapalConfig = {
      ...config,
      apiBaseUrl: 'http://cybqa.pesapal.com/pesapalv3/api',
    };
    expect(() => new Pesapal(invalidConfig)).toThrow(
      'apiBaseUrl must use HTTPS for security.'
    );
  });

  it('should get auth token', async () => {
    const mockAuthResponse: AuthResponse = {
      token: 'test_token',
      expiryDate: '2025-12-31T23:59:59.999Z',
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockAuthResponse });

    const token = await pesapal.getAuthToken();

    expect(token).toBe('test_token');
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/Auth/RequestToken', {
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
    });
  });

  it('should register IPN', async () => {
    const mockAuthResponse: AuthResponse = {
      token: 'test_token',
      expiryDate: '2025-12-31T23:59:59.999Z',
    };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const mockIpnResponse: IPNRegistrationResponse = {
      ipn_id: 'test_ipn_id',
      url: 'https://test.com/ipn',
    };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: mockIpnResponse });

    const ipnData: IPNRegistrationRequest = {
      url: 'https://test.com/ipn',
      ipn_notification_type: 'POST',
    };
    const response = await pesapal.registerIPN(ipnData);

    expect(response).toEqual(mockIpnResponse);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/URLSetup/RegisterIPN', ipnData, {
      headers: { Authorization: 'Bearer test_token' },
    });
  });

  it('should submit order', async () => {
    const mockAuthResponse: AuthResponse = {
      token: 'test_token',
      expiryDate: '2025-12-31T23:59:59.999Z',
    };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const mockPaymentResponse: PaymentResponse = {
      order_tracking_id: 'test_tracking_id',
      merchant_reference: 'test_merchant_ref',
      redirect_url: 'https://test.com/redirect',
      status: '1',
      error: null,
    };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: mockPaymentResponse });

    const paymentData: PaymentRequest = {
      id: 'test_order_id',
      currency: 'KES',
      amount: 100,
      description: 'Test payment',
      callback_url: 'https://test.com/callback',
      notification_id: 'test_ipn_id',
      billing_address: {
        email_address: 'test@test.com',
      },
    };
    const response = await pesapal.submitOrder(paymentData);

    expect(response).toEqual(mockPaymentResponse);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/Transactions/SubmitOrderRequest', paymentData, {
      headers: { Authorization: 'Bearer test_token' },
    });
  });

  it('should throw an error for missing payment request data', async () => {
    const paymentData: Partial<PaymentRequest> = {
      id: 'test_order_id',
    };
    await expect(pesapal.submitOrder(paymentData as PaymentRequest)).rejects.toThrow(
      'Missing required payment request data.'
    );
  });

  it('should throw an error for invalid amount', async () => {
    const paymentData: PaymentRequest = {
      id: 'test_order_id',
      currency: 'KES',
      amount: -100,
      description: 'Test payment',
      callback_url: 'https://test.com/callback',
      notification_id: 'test_ipn_id',
      billing_address: {
        email_address: 'test@test.com',
      },
    };
    await expect(pesapal.submitOrder(paymentData)).rejects.toThrow('Invalid amount.');
  });

  it('should get transaction status', async () => {
    const mockAuthResponse: AuthResponse = {
      token: 'test_token',
      expiryDate: '2025-12-31T23:59:59.999Z',
    };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const mockStatusResponse: TransactionStatusResponse = {
      status: 'COMPLETED',
      payment_method: 'Visa',
      amount: 100,
      currency: 'KES',
    };
    mockAxiosInstance.get.mockResolvedValue({ data: mockStatusResponse });

    const orderTrackingId = 'test_tracking_id';
    const response = await pesapal.getTransactionStatus(orderTrackingId);

    expect(response).toEqual(mockStatusResponse);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
        headers: { Authorization: 'Bearer test_token' },
      }
    );
  });
});
