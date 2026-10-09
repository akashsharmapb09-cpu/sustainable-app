import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default ProtectedRoute;
