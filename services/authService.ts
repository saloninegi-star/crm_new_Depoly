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

export type StaffRoleType = 'weighbridge' | 'accounts' | 'godown_incharge' | 'gate_guard' | 'hr' | 'owner';

// Endpoints mapped by role (No phone numbers hardcoded!)
const ENDPOINTS: Record<StaffRoleType, { sendOtp: string; login: string }> = {
  weighbridge: {
    sendOtp: '/staff/weighbridge/send-otp',
    login: '/staff/weighbridge/verify-otp',
  },
  accounts: {
    sendOtp: '/staff/accounts/send-otp',
    login: '/staff/accounts/verify-otp',
  },
  godown_incharge: {
    sendOtp: '/staff/godown_incharge/send-otp',
    login: '/staff/godown_incharge/login',
  },
  gate_guard: {
    sendOtp: '/staff/gate_guard/send-otp',
    login: '/staff/gate_guard/login',
  },
  hr: {
    sendOtp: '/staff/hr/send-otp',
    login: '/staff/hr/login',
  },
  owner: {
    sendOtp: '/auth/send-otp',
    login: '/auth/login-otp',
  },
};

export const authService = {
  // DYNAMIC SEND OTP: Works for ANY new phone number without hardcoding!
  sendOtp: async (
    mobile: string
  ): Promise<{ data: SendOtpResponse; detectedType: StaffRoleType }> => {
    const cleanMobile = mobile.trim();

    // Check staff endpoints first, owner last
    const rolesToTry: StaffRoleType[] = [
      'weighbridge',
      'accounts',
      'godown_incharge',
      'gate_guard',
      'hr',
      'owner',
    ];

    let lastError: unknown = null;
    for (const type of rolesToTry) {
      try {
        const response = await api.post<SendOtpResponse>(ENDPOINTS[type].sendOtp, { mobile: cleanMobile });
        return { data: response.data, detectedType: type };
      } catch (err: unknown) {
        lastError = err;
      }
    }

    throw lastError;
  },

  // DYNAMIC LOGIN: Automatically sets user profile returned by backend
  loginWithOtp: async (
    mobile: string,
    otp: string,
    detectedType?: StaffRoleType
  ): Promise<UnifiedLoginResult> => {
    const cleanMobile = mobile.trim();
    const cleanOtp = otp.trim();
    const roleType = detectedType || 'owner';

    if (roleType === 'owner') {
      const res = await api.post<LoginResponse>(ENDPOINTS.owner.login, { mobile: cleanMobile, otp: cleanOtp });
      return {
        access_token: res.data.access_token,
        token_type: res.data.token_type || 'bearer',
        role: res.data.role || 'superadmin',
        user_name: 'Mill Owner',
        mobile: cleanMobile,
        profile: null,
      };
    }

    // Call staff endpoint
    const res = await api.post<LoginResponse>(ENDPOINTS[roleType].login, { mobile: cleanMobile, otp: cleanOtp });
    const profile = res.data.profile;

    // Use actual name returned from backend database
    const rawName = profile?.name || roleType;
    const formattedName = rawName
      .split(' ')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    return {
      access_token: res.data.access_token,
      token_type: res.data.token_type || 'bearer',
      role: profile?.role || roleType,
      user_name: formattedName,
      mobile: cleanMobile,
      profile,
    };
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