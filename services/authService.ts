import api from '../lib/axios';

// TypeScript Interfaces for API Requests & Responses
export interface SendOtpRequest {
  mobile: string;
}

export interface SendOtpResponse {
  detail: string;
  otp?: string;
}

export interface LoginOtpRequest {
  mobile: string;
  otp: string;
}

export interface LoginOtpResponse {
  access_token: string;
  token_type: string;
  role: string;
  must_change_password: boolean;
}

export const authService = {
  // 1. Send OTP API
  sendOtp: async (mobile: string): Promise<SendOtpResponse> => {
    const response = await api.post<SendOtpResponse>('/auth/send-otp', {
      mobile,
    });
    return response.data;
  },

  // 2. Login with OTP API
  loginWithOtp: async (mobile: string, otp: string): Promise<LoginOtpResponse> => {
    const response = await api.post<LoginOtpResponse>('/auth/login-otp', {
      mobile,
      otp,
    });
    return response.data;
  },

  // 3. Logout Helper
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user_role');
      localStorage.removeItem('kognos_role');
      localStorage.removeItem('kognos_user');
    }
  },
};