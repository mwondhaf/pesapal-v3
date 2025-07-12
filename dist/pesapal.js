"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pesapal = void 0;
// src/pesapal.ts
const axios_1 = require("./utils/axios");
class Pesapal {
    constructor(config) {
        this.config = config;
        this.axiosInstance = (0, axios_1.createAxiosInstance)(config);
    }
    async getAuthToken() {
        const response = await this.axiosInstance.post('/Auth/RequestToken', {
            consumer_key: this.config.consumerKey,
            consumer_secret: this.config.consumerSecret,
        });
        return response.data.token;
    }
    async registerIPN(data) {
        const token = await this.getAuthToken();
        const response = await this.axiosInstance.post('/URLSetup/RegisterIPN', data, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    }
    async submitOrder(data) {
        if (!data.id || !data.currency || !data.amount || !data.description || !data.callback_url || !data.notification_id) {
            throw new Error('Missing required payment request data.');
        }
        if (typeof data.amount !== 'number' || data.amount <= 0) {
            throw new Error('Invalid amount.');
        }
        const token = await this.getAuthToken();
        const response = await this.axiosInstance.post('/Transactions/SubmitOrderRequest', data, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    }
    async getTransactionStatus(orderTrackingId) {
        const token = await this.getAuthToken();
        const response = await this.axiosInstance.get(`/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    }
}
exports.Pesapal = Pesapal;
