"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pesapal = void 0;
// src/pesapal.ts
const ky_1 = __importDefault(require("ky"));
class Pesapal {
    constructor(config) {
        this.config = config;
        this.kyInstance = ky_1.default.create({
            prefixUrl: config.apiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async getAuthToken() {
        const response = await this.kyInstance.post('Auth/RequestToken', {
            json: {
                consumer_key: this.config.consumerKey,
                consumer_secret: this.config.consumerSecret,
            },
        }).json();
        return response.token;
    }
    async registerIPN(data) {
        const token = await this.getAuthToken();
        const response = await this.kyInstance.post('URLSetup/RegisterIPN', {
            json: data,
            headers: { Authorization: `Bearer ${token}` },
        }).json();
        return response;
    }
    async submitOrder(data) {
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
        }).json();
        return response;
    }
    async getTransactionStatus(orderTrackingId) {
        const token = await this.getAuthToken();
        const response = await this.kyInstance.get(`Transactions/GetTransactionStatus`, {
            searchParams: { orderTrackingId },
            headers: { Authorization: `Bearer ${token}` },
        }).json();
        return response;
    }
}
exports.Pesapal = Pesapal;
