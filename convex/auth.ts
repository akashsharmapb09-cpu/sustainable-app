import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { Email } from "@convex-dev/auth/providers/Email";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel";

const emailProvider = Resend({
  from: process.env.AUTH_EMAIL ?? "GreenSwap <onboarding@resend.dev>",
  apiKey: process.env.AUTH_RESEND_KEY,
});

const resetCodeProvider = Email({
  id: "password-reset",
  from: process.env.AUTH_EMAIL ?? "GreenSwap <onboarding@resend.dev>",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 60,
  async sendVerificationRequest({ identifier, provider, token, expires }) {
    const apiKey = provider.apiKey;
    if (!apiKey) throw new Error("AUTH_RESEND_KEY is required to send password reset codes.");
    const escapedCode = token.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character] ?? character);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: provider.from,
        to: [identifier],
        subject: "Reset your GreenSwap passphrase",
        text: `Your GreenSwap reset code is ${token}. It expires at ${expires.toISOString()}.`,
        html: `<p>Your GreenSwap reset code is <strong>${escapedCode}</strong>.</p><p>This code expires at ${expires.toISOString()}.</p>`,
      }),
    });
    if (!response.ok) {
      throw new Error(`Password reset email delivery failed (${response.status}).`);
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      profile(params) {
        if (typeof params.email !== "string" || !params.email.trim()) {
          throw new Error("A valid email address is required.");
        }
        return {
          email: params.email.trim().toLowerCase(),
          ...(typeof params.name === "string" && params.name.trim()
            ? { name: params.name.trim() }
            : {}),
        };
      },
      verify: emailProvider,
      reset: resetCodeProvider,
    }),
    Resend({
      from: process.env.AUTH_EMAIL ?? "GreenSwap <onboarding@resend.dev>",
      apiKey: process.env.AUTH_RESEND_KEY,
    }),
    Google,
    GitHub,
  ],
});
