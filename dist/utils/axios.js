"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAxiosInstance = createAxiosInstance;
// src/utils/axios.ts
const axios_1 = __importDefault(require("axios"));
function createAxiosInstance(config) {
    return axios_1.default.create({
        baseURL: config.apiBaseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
