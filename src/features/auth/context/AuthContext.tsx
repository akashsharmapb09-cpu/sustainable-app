import React, { createContext, useContext } from "react";

type AuthContextType = {
  user: any;
  profile: any;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: { id: "demo-user" },
  profile: { id: "demo-user" },
  isAuthenticated: true,
  loading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = {
    user: { id: "demo-user", email: "demo@greenswap.app" },
    profile: { id: "demo-user", onboarding_completed: false },
    isAuthenticated: true,
    loading: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export const useConvexAuth = () => ({ isAuthenticated: true, isLoading: false });
