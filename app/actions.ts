"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { swaps } from "@/lib/data";

const completedCookie = "greenswap_completed_swaps";
const demoCookie = "greenswap_demo";

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/dashboard/explore";
  return value.startsWith("/dashboard/") || value === "/dashboard" ? value : "/dashboard/explore";
}

function readCompleted(raw: string | undefined) {
  if (!raw) return [] as string[];
  try {
    const value: unknown = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [] as string[];
  }
}

export async function startDemo(formData: FormData) {
  const store = await cookies();
  store.set(demoCookie, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(safeNextPath(formData.get("next")));
}

export async function logoutDemo() {
  const store = await cookies();
  store.delete(demoCookie);
  store.delete(completedCookie);
  redirect("/login");
}

export async function setSwapCompletion(formData: FormData) {
  const store = await cookies();
  if (!store.has(demoCookie)) redirect("/login?next=/dashboard/explore");

  const id = formData.get("swapId");
  if (typeof id !== "string" || !swaps.some((swap) => swap.id === id)) {
    redirect("/dashboard/explore");
  }

  const shouldComplete = formData.get("completed") === "1";
  const current = readCompleted(store.get(completedCookie)?.value);
  const next = shouldComplete
    ? Array.from(new Set([...current, id]))
    : current.filter((currentId) => currentId !== id);

  store.set(completedCookie, encodeURIComponent(JSON.stringify(next)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/activity");
  revalidatePath("/dashboard/account");
  redirect(shouldComplete ? "/dashboard/activity" : "/dashboard/explore");
}
