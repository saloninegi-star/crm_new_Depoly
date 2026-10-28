import api from '../lib/axios';

export interface SendOtpResponse {
  detail: string;
  mobile?: string;
  role?: string;
  role_display?: string;
  otp?: string;
}

export interface UserEntity {
  id?: number | string;
  username?: string;
  full_name?: string;
  name?: string;
  email?: string | null;
  mobile?: string;
  role?: string;
  role_display?: string;
  is_active?: boolean;
}

export interface UserProfile {
  id?: number | string;
  name?: string;
  full_name?: string;
  email?: string | null;
  mobile?: string;
  address?: string | null;
  profile_pic_url?: string | null;
  role?: string;
  role_display?: string;
  is_active?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  role_display?: string;
  must_change_password?: boolean;
  user?: UserEntity;
  profile?: UserProfile;
}

export interface UnifiedLoginResult {
  access_token: string;
  token_type: string;
  role: string;
  user_name: string;
  mobile: string;
  profile: UserProfile;
}

export type StaffRoleType =
  | 'owner'
  | 'gate_guard'
  | 'weighbridge'
  | 'godown_incharge'
  | 'hr'
  | 'accounts'
  | 'milling'
  | 'finished_stock'
  | 'sales_dispatch'


// Role Normalizer
export function normalizeUserRole(rawRole: unknown): string {
  if (typeof rawRole !== 'string') {
    if (rawRole && typeof rawRole === 'object') {
      const roleObject = rawRole as { id?: unknown; role?: unknown };
      return normalizeUserRole(roleObject.id || roleObject.role);
    }
    return '';
  }

  const value = rawRole.trim();
  if (!value) return '';

  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return normalizeUserRole(parsed);
    }
  } catch {
    // Plain string
  }

  const normalized = value.toLowerCase().replace(/[-\s]+/g, '_');
  const aliases: Record<string, string> = {
    admin: 'owner',
    superadmin: 'owner',
    mill_owner: 'owner',
    'owner_/_super_admin': 'owner',
    gate_security_guard: 'gate_guard',
    security_guard: 'gate_guard',
    weighbridge_operator: 'weighbridge',
    godown_in_charge: 'godown_incharge',
    paddy_stock: 'godown_incharge',
    hr_manager: 'hr',
    accounts_officer: 'accounts',
    milling_supervisor: 'milling',
    packaging: 'finished_stock',
    sales_dispatch_incharge: 'sales_dispatch',
  };

  return aliases[normalized] || normalized;
}

export const authService = {
  // 🟢 SINGLE UNIFIED SEND OTP (All roles supported from 1 endpoint)
  sendOtp: async (mobile: string): Promise<{ data: SendOtpResponse; detectedType: string }> => {
    const cleanMobile = mobile.trim();

    // Direct single call to /auth/send-otp
    const res = await api.post<SendOtpResponse>('/auth/send-otp', {
      mobile: cleanMobile,
    });

    const detectedRole = normalizeUserRole(res.data.role) || 'owner';
    return { data: res.data, detectedType: detectedRole };
  },

  // 🟢 SINGLE UNIFIED VERIFY OTP (All roles supported from 1 endpoint)
  loginWithOtp: async (mobile: string, otp: string): Promise<UnifiedLoginResult> => {
    const cleanMobile = mobile.trim();
    const cleanOtp = otp.trim();

    // Direct single call to /auth/verify-otp
    const res = await api.post<LoginResponse>('/auth/verify-otp', {
      mobile: cleanMobile,
      otp: cleanOtp,
    });

    const data = res.data;

    // Backend se real user aur profile nikalna
    const profile = data.profile || data.user;
    const realName =
      profile?.name ||
      profile?.full_name ||
      data.user?.full_name ||
      data.user?.username ||
      'User';

    const normalizedRole = normalizeUserRole(data.role || profile?.role || data.user?.role) || 'owner';

    const finalProfile: UserProfile = {
      id: profile?.id,
      name: realName,
      full_name: realName,
      email: profile?.email || null,
      mobile: cleanMobile,
      role: normalizedRole,
      role_display: data.role_display || profile?.role_display,
      is_active: profile?.is_active ?? true,
    };

    return {
      access_token: data.access_token,
      token_type: data.token_type || 'bearer',
      role: normalizedRole,
      user_name: realName,
      mobile: cleanMobile,
      profile: finalProfile,
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
      localStorage.removeItem('user_mobile');
    }
  },
};