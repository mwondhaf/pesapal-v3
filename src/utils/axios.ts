// src/utils/axios.ts
import axios, { AxiosInstance } from 'axios';
import { PesapalConfig } from '../types';

export function createAxiosInstance(config: PesapalConfig): AxiosInstance {
  return axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}