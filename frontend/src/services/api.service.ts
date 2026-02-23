import axios, { AxiosError } from 'axios';
import { BondInput, BondCalculationResult } from '../types/bond.types';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Calculate bond yields and cash flows
 */
export const calculateBond = async (
  input: BondInput
): Promise<BondCalculationResult> => {
  try {
    const response = await apiClient.post<BondCalculationResult>(
      '/bond/calculate',
      input
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Transform axios errors into structured API errors
 */
const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response) {
      // Server responded with error
      const data = axiosError.response.data;
      return {
        message: data.message || 'Server error occurred',
        statusCode: axiosError.response.status,
        errors: data.errors || [],
      };
    } else if (axiosError.request) {
      // Request made but no response
      return {
        message: 'Unable to connect to server. Please ensure the backend is running.',
        statusCode: 0,
      };
    }
  }
  
  // Unknown error
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
};

export default apiClient;
