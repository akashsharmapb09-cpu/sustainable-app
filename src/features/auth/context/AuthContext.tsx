import React, { createContext, useContext, useMemo } from "react";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { getLocalProfile } from "../../../shared/lib/localStore";
type Profile = any;
type UserRoleType = any;
const getStoredProfiles = () => {
  try {
    const raw = localStorage.getItem("sustainable_profiles") || localStorage.getItem("profiles") || "[]";
    return JSON.parse(raw);
  } catch { return []; }
};
type AuthUser = {
  id: string;
  email: string | null;
  created_at: string;
  email_confirmed_at: string | null;
  user_metadata: any;
};

type AuthContextType = {
  user: AuthUser | null;
  profile: Profile | null;
  role: UserRoleType;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: "user",
  isLoading: true,
  isAuthenticated: false,
});

const isConvexConfigured = () =>!!import.meta.env.VITE_CONVEX_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const convexAuth = useConvexAuth();
  const isAuthenticated = convexAuth.isAuthenticated;
  const authLoading = convexAuth.isLoading;

  const currentUser = useQuery(
    api.users.current,
    isAuthenticated && isConvexConfigured()? {} : "skip"
  ) as any;

  const demoActive =!isConvexConfigured() || localStorage.getItem("greenswap_demo") === "1";

  const demoProfile = useMemo(() => getLocalProfile("demo-user") as Profile | null, []);

  const storedProfiles = useMemo(() => getStoredProfiles() as Profile[], [currentUser]);

  const user: AuthUser | null = useMemo(() => {
    if (demoActive) {
      return {
        id: "demo-user",
        email: "demo@greenswap.local",
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        user_metadata: { full_name: "Field Demo" },
      } as AuthUser;
    }
    if (currentUser === undefined) return null;
    if (currentUser === null) return null;
    return {
      id: currentUser._id,
      email: currentUser.email?? null,
      created_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {},
    } as AuthUser;
  }, [demoActive, currentUser]);

  const profile = useMemo(() => {
    if (demoActive) return demoProfile;
    return (storedProfiles?.[0] as Profile)?? null;
  }, [demoActive, demoProfile, storedProfiles]);

  const role: UserRoleType = (currentUser?.role as UserRoleType)?? "user";

  const isLoading =!demoActive && isConvexConfigured() && (authLoading || (isAuthenticated && currentUser === undefined));

  return (
    <AuthContext.Provider value={{ user, profile, role, isLoading, isAuthenticated: demoActive? true : isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
