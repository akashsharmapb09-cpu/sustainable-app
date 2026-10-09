import { ConvexReactClient } from "convex/react";
import { env, isConvexConfigured } from "../config/env";

export const convex = new ConvexReactClient(
  isConvexConfigured() && env.VITE_CONVEX_URL
    ? env.VITE_CONVEX_URL
    : "https://greenswap-demo-000000.convex.cloud",
);
