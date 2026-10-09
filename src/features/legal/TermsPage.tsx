import { Link } from 'react-router-dom';

export function TermsPage() {
  return <main className="min-h-screen bg-[#F7F5F0] text-[#0E0E0E]">
    <header className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-10 lg:px-[8%]"><Link to="/" className="font-serif text-2xl">GreenSwap<span className="text-[#b64b2c]">.</span></Link><Link to="/dashboard" className="text-sm underline underline-offset-4">Back to dashboard ↗</Link></header>
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-black/55">LEGAL / 01</p>
      <h1 className="mt-5 font-serif text-6xl tracking-[-.04em] sm:text-7xl">Terms of use<span className="text-[#b64b2c]">.</span></h1>
      <p className="mt-5 text-sm leading-6 text-black/60">Effective date: 9 October 2026</p>
      <p className="mt-8 text-base leading-7">These terms describe the basic conditions for using GreenSwap. By using the site, you agree to use it lawfully and to read these terms. If you do not agree, please stop using the service.</p>
      <div className="mt-10 space-y-8">
        <section><h2 className="font-serif text-3xl">1. What GreenSwap provides</h2><p className="mt-3 leading-7 text-black/70">GreenSwap offers general ideas for sustainable lifestyle choices, including food, travel, energy and reuse. Suggestions are informational only, may not suit every situation and are not professional, financial or environmental certification advice.</p></section>
        <section><h2 className="font-serif text-3xl">2. Estimates and illustrative content</h2><p className="mt-3 leading-7 text-black/70">Any sample figures, impact displays or examples are illustrative unless clearly identified as measured and supported by a stated method and source. Do not rely on demo figures as a measurement of your personal environmental impact or guaranteed savings.</p></section>
        <section><h2 className="font-serif text-3xl">3. Your responsibilities</h2><p className="mt-3 leading-7 text-black/70">Provide accurate information when you choose to enter it. Do not misuse the site, attempt to disrupt its operation, upload unlawful material or access data that does not belong to you.</p></section>
        <section><h2 className="font-serif text-3xl">4. Accounts and local storage</h2><p className="mt-3 leading-7 text-black/70">Some preferences and saved choices may be stored in your browser on your device. Clearing browser storage can remove them. Do not use shared devices for private information unless you trust the device and know how to clear its data.</p></section>
        <section><h2 className="font-serif text-3xl">5. Availability and changes</h2><p className="mt-3 leading-7 text-black/70">Features may change, be interrupted or be removed. We provide the service on an as-available basis to the extent permitted by applicable law. Nothing in these terms limits rights that cannot legally be limited.</p></section>
        <section><h2 className="font-serif text-3xl">6. Third-party services</h2><p className="mt-3 leading-7 text-black/70">Links or integrations may be provided by third parties. Their services are governed by their own terms and privacy notices. GreenSwap does not claim to control third-party services.</p></section>
        <section><h2 className="font-serif text-3xl">7. Intellectual property</h2><p className="mt-3 leading-7 text-black/70">Unless otherwise stated, the site's original design and content belong to their respective owners. You may use the site for personal, lawful purposes and may not copy or redistribute protected content in ways that violate applicable law.</p></section>
        <section><h2 className="font-serif text-3xl">8. Contact and governing law</h2><p className="mt-3 leading-7 text-black/70">GreenSwap is an evolving project. Before public commercial launch, add a verified operator name, contact email and governing-law details here. Nothing on this page is intended to override mandatory consumer protections.</p></section>
      </div>
      <p className="mt-12 border-t border-black/10 pt-5 font-mono text-[10px] uppercase tracking-wider text-black/45">Draft terms. Have these reviewed for your jurisdiction before commercial launch.</p>
    </article>
    <footer className="border-t border-black/10 px-5 py-6 text-sm text-black/55 sm:px-10 lg:px-[8%]">Built to make a lighter footprint. Keep the good life. <span className="float-right"><Link to="/terms" className="underline">Terms</Link> · <Link to="/privacy" className="underline">Privacy</Link></span></footer>
  </main>;
}
export default TermsPage;
