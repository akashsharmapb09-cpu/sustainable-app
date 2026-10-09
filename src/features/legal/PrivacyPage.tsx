import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return <main className="min-h-screen bg-[#F7F5F0] text-[#0E0E0E]">
    <header className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-10 lg:px-[8%]"><Link to="/" className="font-serif text-2xl">GreenSwap<span className="text-[#b64b2c]">.</span></Link><Link to="/dashboard" className="text-sm underline underline-offset-4">Back to dashboard ↗</Link></header>
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-black/55">LEGAL / 02</p><h1 className="mt-5 font-serif text-6xl tracking-[-.04em] sm:text-7xl">Privacy note<span className="text-[#b64b2c]">.</span></h1><p className="mt-5 text-sm text-black/60">Effective date: 9 October 2026</p>
    <p className="mt-8 text-base leading-7">GreenSwap is designed around practical suggestions, not surveillance. This page describes the current prototype behavior. It must be updated if analytics, email delivery, accounts or payment services are connected.</p>
    <div className="mt-10 space-y-8">
    <section><h2 className="font-serif text-3xl">Information stored on your device</h2><p className="mt-3 leading-7 text-black/70">The current app stores profile preferences, saved swaps, weekly ritual choices and local newsletter form entries in browser storage. This data remains in that browser unless you clear it or your browser or device settings remove it. It is not automatically synced between devices.</p></section>
    <section><h2 className="font-serif text-3xl">Analytics</h2><p className="mt-3 leading-7 text-black/70">Optional Plausible event calls are attempted only when a site domain is configured and Do Not Track is not enabled. The intended events are dashboard views, onboarding completion and swap toggles. Confirm the deployed analytics configuration and provider policy before launch.</p></section>
    <section><h2 className="font-serif text-3xl">Email and sharing</h2><p className="mt-3 leading-7 text-black/70">The newsletter form currently stores entered addresses locally and does not send them to a mailing service. Sharing uses your device's native share function or clipboard when available. Review the text before sharing.</p></section>
    <section><h2 className="font-serif text-3xl">Children, security and retention</h2><p className="mt-3 leading-7 text-black/70">Do not enter sensitive personal information. Browser-local data may be visible to anyone with access to the same browser profile. Clear local storage to remove locally saved information.</p></section>
    <section><h2 className="font-serif text-3xl">Contact and updates</h2><p className="mt-3 leading-7 text-black/70">Before public launch, add a verified operator name and privacy contact email. This draft is not legal advice and should be reviewed against the actual data flows and applicable law.</p></section>
    </div><p className="mt-12 border-t border-black/10 pt-5 font-mono text-[10px] uppercase tracking-wider text-black/45">Prototype privacy notice. Review before commercial launch.</p></article>
    <footer className="border-t border-black/10 px-5 py-6 text-sm text-black/55 sm:px-10 lg:px-[8%]">Built to make a lighter footprint. Keep the good life.</footer>
  </main>;
}
export default PrivacyPage;
