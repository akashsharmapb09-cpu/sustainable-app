"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submitPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setMessage("Newsletter delivery is not connected in this demo; no email was sent.");
  }

  return (
    <>
      <form className="mt-5 flex max-w-sm rounded-full border border-line p-1" onSubmit={submitPreview}>
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input id="newsletter-email" type="email" required value={email}
          onChange={(event) => { setEmail(event.target.value); setMessage(""); }}
          placeholder="Your email address"
          className="min-w-0 flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-gray-400" />
        <button type="submit" aria-label="Preview newsletter signup"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-forest">
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </form>
      {message && <p role="status" className="mt-2 text-xs leading-5 text-gray-500">{message}</p>}
    </>
  );
}
