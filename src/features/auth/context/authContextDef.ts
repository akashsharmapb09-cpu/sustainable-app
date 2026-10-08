import { createContext, useContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, UserRoleType } from '../../../shared/types/database';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRoleType;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsEmailVerification: boolean;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupWithPassword: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  loginWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'github') => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
