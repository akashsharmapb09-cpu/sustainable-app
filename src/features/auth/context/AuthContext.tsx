import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useAction, useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../../../../convex/_generated/api";
import { queryClient } from "../../../shared/lib/queryClient";
import { isConvexConfigured } from "../../../shared/config/env";
import {
  clearLocalUserData,
  defaultProfile,
  getLocalProfile,
  setLocalProfile,
} from "../../../shared/lib/localStore";
import type { Profile, UserRoleType } from "../../../shared/types/database";
import { rateLimiter } from "../lib/rateLimiter";
import { AuthContext, type AuthUser } from "./authContextDef";

const DEMO_STORAGE_KEY = "greenswap-demo-session";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

function demoUser(): AuthUser {
  return {
    id: "demo-user",
    email: "demo@greenswap.local",
    created_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    user_metadata: { full_name: "Field Demo" },
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.current, isAuthenticated ? {} : "skip");
  const storedProfiles = useQuery(
    api.data.list,
    isAuthenticated ? { collection: "profiles" } : "skip",
  );
  const deleteMyAccount = useMutation(api.data.deleteAccount);
  const revokeSessions = useAction(api.users.logoutAllSessions);
  const [demoActive, setDemoActive] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(DEMO_STORAGE_KEY) === "1",
  );
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const demoProfile = demoActive ? getLocalProfile("demo-user") : null;

  const user = useMemo<AuthUser | null>(() => {
    if (demoActive) return demoUser();
    if (!currentUser) return null;
    return {
      id: currentUser.id,
      email: currentUser.email,
      created_at: new Date(currentUser.createdAt).toISOString(),
      email_confirmed_at: currentUser.emailVerificationTime
        ? new Date(currentUser.emailVerificationTime).toISOString()
        : null,
      user_metadata: { full_name: currentUser.name ?? "" },
    };
  }, [demoActive, currentUser]);

  const profile = demoActive
    ? demoProfile
    : ((storedProfiles?.[0] as Profile | undefined) ?? null);
  const role: UserRoleType = demoActive ? "user" : currentUser?.role ?? "user";
  const isLoading = !demoActive
    && isConvexConfigured()
    && (authLoading || (isAuthenticated && currentUser === undefined));

  const enterDemoSession = useCallback(() => {
    const user = demoUser();
    const existing = getLocalProfile(user.id)
      ?? defaultProfile(user.id, user.email ?? "", "Field Demo");
    setLocalProfile(existing);
    localStorage.setItem(DEMO_STORAGE_KEY, "1");
    setDemoActive(true);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setDemoActive(false);
    queryClient.clear();
    if (!demoActive) await signOut();
  }, [demoActive, signOut]);

  const logoutAllDevices = useCallback(async () => {
    if (demoActive) {
      await logout();
      return;
    }
    await revokeSessions({});
    await logout();
  }, [demoActive, logout, revokeSessions]);


  useEffect(() => {
    if (!isAuthenticated && !demoActive) queryClient.clear();
  }, [isAuthenticated, demoActive]);

  useEffect(() => {
    if (!user) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const resetIdleTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => void logout(), IDLE_TIMEOUT_MS);
    };
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }));
    resetIdleTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
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
      const signedIn = await signIn("password", { email, password, flow: "signIn" });
      rateLimiter.recordSuccess(`login:${email}`);
      if (!signedIn) {
        setNeedsEmailVerification(true);
        return { success: false, error: "Check your email to verify your account before signing in." };
      }
      setNeedsEmailVerification(false);
      return { success: true };
    } catch {
      rateLimiter.recordFailure(`login:${email}`);
      return { success: false, error: "Invalid email or password." };
    }
  }, [signIn]);

  const signupWithPassword = useCallback(async (
    email: string,
    password: string,
    fullName?: string,
  ) => {
    try {
      const signedIn = await signIn("password", {
        email,
        password,
        name: fullName ?? "",
        flow: "signUp",
        redirectTo: `${window.location.origin}/auth/verify-email`,
      });
      const needsVerification = !signedIn;
      setNeedsEmailVerification(needsVerification);
      return { success: true, needsVerification };
    } catch (error) {
      return { success: false, error: errorMessage(error, "Failed to create account.") };
    }
  }, [signIn]);

  const loginWithMagicLink = useCallback(async (email: string) => {
    const rateCheck = rateLimiter.check(`magic:${email}`, 3, 10 * 60 * 1000);
    if (rateCheck.isBlocked) {
      return { success: false, error: "Too many requests. Please wait before requesting another link." };
    }
    try {
      await signIn("resend", {
        email,
        redirectTo: `${window.location.origin}/dashboard`,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, "Unable to send a magic link.") };
    }
  }, [signIn]);

  const loginWithOAuth = useCallback(async (provider: "google" | "github") => {
    try {
      await signIn(provider, { redirectTo: `${window.location.origin}/dashboard` });
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, `Failed to initiate ${provider} login.`) };
    }
  }, [signIn]);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      await signIn("password", {
        email,
        flow: "reset",
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, "Failed to send password reset link.") };
    }
  }, [signIn]);

  const updatePassword = useCallback(async (password: string, email: string, code: string) => {
    if (!email || !code) {
      return { success: false, error: "The reset code is missing or expired. Request a new one." };
    }
    try {
      await signIn("password", {
        email,
        code,
        newPassword: password,
        flow: "reset-verification",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, "Failed to update passphrase.") };
    }
  }, [signIn]);

  const deleteAccount = useCallback(async () => {
    if (!user) return { success: false, error: "Not authenticated." };
    if (user.id === "demo-user") {
      clearLocalUserData(user.id);
      await logout();
      return { success: true };
    }
    try {
      await deleteMyAccount({});
      await logout();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, "Account deletion could not be completed. Please try again."),
      };
    }
  }, [user, logout, deleteMyAccount]);

  const refreshProfile = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
  }, [user?.id]);

  const value = useMemo(() => ({
    user,
    session: null,
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
    enterDemoSession,
  }), [
    user, profile, role, isLoading, needsEmailVerification, loginWithPassword,
    signupWithPassword, loginWithMagicLink, loginWithOAuth, requestPasswordReset,
    updatePassword, logout, logoutAllDevices, deleteAccount, refreshProfile, enterDemoSession,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
