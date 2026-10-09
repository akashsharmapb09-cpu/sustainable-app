import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './authContextDef';

const demoAuthValue: AuthContextType = {
  user: {
    id: 'demo-user',
    email: 'demo@greenswap.app',
    created_at: '2026-01-01T00:00:00.000Z',
    email_confirmed_at: null,
    user_metadata: { full_name: 'GreenSwap Demo' },
  },
  session: null,
  profile: null,
  role: 'user',
  isLoading: false,
  isAuthenticated: true,
  needsEmailVerification: false,
  loginWithPassword: async () => ({ success: false, error: 'Password sign-in is not enabled in this demo.' }),
  signupWithPassword: async () => ({ success: false, error: 'Account creation is not enabled in this demo.' }),
  loginWithMagicLink: async () => ({ success: false, error: 'Magic-link sign-in is not enabled in this demo.' }),
  loginWithOAuth: async () => ({ success: false, error: 'OAuth sign-in is not enabled in this demo.' }),
  requestPasswordReset: async () => ({ success: false, error: 'Password recovery is not enabled in this demo.' }),
  updatePassword: async () => ({ success: false, error: 'Password updates are not enabled in this demo.' }),
  logout: async () => {},
  logoutAllDevices: async () => {},
  deleteAccount: async () => ({ success: false, error: 'Account deletion is not available in demo mode.' }),
  refreshProfile: async () => {},
  enterDemoSession: () => {},
};

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={demoAuthValue}>{children}</AuthContext.Provider>;
}
