import { useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../../shared/lib/supabase';
import { queryClient } from '../../../shared/lib/queryClient';
import type { Profile, UserRoleType } from '../../../shared/types/database';
import { rateLimiter } from '../lib/rateLimiter';
import { AuthContext } from './authContextDef';


// Idle timeout limit: 30 minutes
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRoleType>('user');
  const [isLoading, setIsLoading] = useState(true);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  // Load profile and roles for user
  const fetchProfileAndRole = useCallback(async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleData) {
        const userRole = (roleData as { role?: UserRoleType }).role;
        if (userRole) {
          setRole(userRole);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch profile/role:', err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole('user');
      queryClient.clear(); // Complete cache scrub
    }
  }, []);

  const logoutAllDevices = useCallback(async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole('user');
      queryClient.clear();
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchProfileAndRole(initialSession.user.id);
          }
        }
      } catch (err) {
        console.warn('Error reading initial session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchProfileAndRole(newSession.user.id);
        } else {
          setProfile(null);
          setRole('user');
          queryClient.clear(); // Clear all cached queries on logout
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileAndRole]);

  // Idle session tracking
  useEffect(() => {
    if (!user) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Idle timeout reached
        logout();
      }, IDLE_TIMEOUT_MS);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [user, logout]);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const rateCheck = rateLimiter.check(`login:${email}`);
    if (rateCheck.isBlocked) {
      return {
        success: false,
        error: `Too many failed attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.`,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        rateLimiter.recordFailure(`login:${email}`);
        return { success: false, error: 'Invalid email or password' };
      }

      rateLimiter.recordSuccess(`login:${email}`);
      if (data.user && !data.user.email_confirmed_at) {
        setNeedsEmailVerification(true);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again later.' };
    }
  }, []);

  const signupWithPassword = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || '' },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const needsVerification = !data.session;
      if (needsVerification) {
        setNeedsEmailVerification(true);
      }
      return { success: true, needsVerification };
    } catch {
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  }, []);

  const loginWithMagicLink = useCallback(async (email: string) => {
    const rateCheck = rateLimiter.check(`magic:${email}`, 3, 10 * 60 * 1000);
    if (rateCheck.isBlocked) {
      return { success: false, error: 'Too many requests. Please wait before requesting another link.' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to send magic link at this time.' };
    }
  }, []);

  const loginWithOAuth = useCallback(async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: `Failed to initiate ${provider} login.` };
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to send password reset link.' };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update passphrase.' };
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);
      if (error) return { success: false, error: error.message };

      await logout();
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to complete account deletion.' };
    }
  }, [user, logout]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfileAndRole(user.id);
    }
  }, [user, fetchProfileAndRole]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role,
      isLoading,
      isAuthenticated: !!user,
      needsEmailVerification,
      loginWithPassword,
      signupWithPassword,
      loginWithMagicLink,
      loginWithOAuth,
      requestPasswordReset,
      updatePassword,
      logout,
      logoutAllDevices,
      deleteAccount,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      role,
      isLoading,
      needsEmailVerification,
      loginWithPassword,
      signupWithPassword,
      loginWithMagicLink,
      loginWithOAuth,
      requestPasswordReset,
      updatePassword,
      logout,
      logoutAllDevices,
      deleteAccount,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
