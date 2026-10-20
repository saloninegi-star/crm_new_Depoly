import api from '../lib/axios';

export interface SendOtpResponse {
  detail: string;
  otp?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  profile_pic_url?: string | null;
  role: string;
  is_active?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role?: string;
  must_change_password?: boolean;
  profile?: UserProfile;
}

export interface UnifiedLoginResult {
  access_token: string;
  token_type: string;
  role: string;
  user_name: string;
  mobile: string;
  profile?: UserProfile | null;
}

// Added 'accounts'
export type StaffRoleType = 'owner' | 'gate_guard' | 'godown_incharge' | 'hr' | 'accounts';

const ENDPOINTS: Record<StaffRoleType, { sendOtp: string; login: string }> = {
  owner: {
    sendOtp: '/auth/send-otp',
    login: '/auth/login-otp',
  },
  gate_guard: {
    sendOtp: '/staff/gate_guard/send-otp',
    login: '/staff/gate_guard/login',
  },
  godown_incharge: {
    sendOtp: '/staff/godown_incharge/send-otp',
    login: '/staff/godown_incharge/login',
  },
  hr: {
    sendOtp: '/staff/hr/send-otp',
    login: '/staff/hr/login',
  },
  accounts: {
    sendOtp: '/staff/accounts/send-otp',
    login: '/staff/accounts/verify-otp', // Accounts uses verify-otp
  },
};

export const authService = {
  // 1. SMART SEND OTP: Auto-detects across all 5 roles
  sendOtp: async (
    mobile: string
  ): Promise<{ data: SendOtpResponse; detectedType: StaffRoleType }> => {
    const rolesToTry: StaffRoleType[] = ['owner', 'gate_guard', 'godown_incharge', 'hr', 'accounts'];
    let lastError: unknown = null;

    for (const type of rolesToTry) {
      try {
        const response = await api.post<SendOtpResponse>(ENDPOINTS[type].sendOtp, { mobile });
        return { data: response.data, detectedType: type };
      } catch (err: unknown) {
        lastError = err;
      }
    }

    throw lastError;
  },

  // 2. SMART LOGIN: Extracts backend profile name & returns role
  loginWithOtp: async (
    mobile: string,
    otp: string,
    detectedType?: StaffRoleType
  ): Promise<UnifiedLoginResult> => {
    if (detectedType && detectedType !== 'owner') {
      const res = await api.post<LoginResponse>(ENDPOINTS[detectedType].login, { mobile, otp });
      const profile = res.data.profile;

      const rawName =
        profile?.name ||
        (detectedType === 'accounts'
          ? 'Accounts Officer'
          : detectedType === 'godown_incharge'
          ? 'Suresh Gupta'
          : detectedType === 'gate_guard'
          ? 'Suraj'
          : detectedType === 'hr'
          ? 'Saloni Negi'
          : 'Staff Member');

      const formattedName = rawName
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      return {
        access_token: res.data.access_token,
        token_type: res.data.token_type || 'bearer',
        role: profile?.role || detectedType,
        user_name: formattedName,
        mobile,
        profile,
      };
    }

    // Try Owner Login
    try {
      const res = await api.post<LoginResponse>(ENDPOINTS.owner.login, { mobile, otp });
      return {
        access_token: res.data.access_token,
        token_type: res.data.token_type || 'bearer',
        role: res.data.role || 'superadmin',
        user_name: 'Mill Owner',
        mobile,
        profile: null,
      };
    } catch {
      // Fallback across staff endpoints
      const staffList: StaffRoleType[] = ['accounts', 'godown_incharge', 'gate_guard', 'hr'];
      for (const type of staffList) {
        try {
          const res = await api.post<LoginResponse>(ENDPOINTS[type].login, { mobile, otp });
          const profile = res.data.profile;
          const rawName = profile?.name || type;
          const formattedName = rawName
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');

          return {
            access_token: res.data.access_token,
            token_type: res.data.token_type || 'bearer',
            role: profile?.role || type,
            user_name: formattedName,
            mobile,
            profile,
          };
        } catch {}
      }
      throw new Error('Invalid OTP or login failed. Please check credentials.');
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user_role');
      localStorage.removeItem('kognos_role');
      localStorage.removeItem('kognos_user');
      localStorage.removeItem('user_profile');
    }
  },
};