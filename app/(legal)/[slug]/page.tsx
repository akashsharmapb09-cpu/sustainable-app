import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Section = { id: string; title: string; body: string[] };
type LegalPage = { title: string; description: string; code: string; sections: Section[] };

const pages: Record<string, LegalPage> = {
  privacy: {
    title: 'Privacy policy',
    description: 'What GreenSwap stores in the demo, why it is stored, and what has not been connected.',
    code: 'LEGAL / PRIVACY',
    sections: [
      { id: 'overview', title: 'At a glance', body: ['This release uses a mock demo session. Dashboard activity, points and settings are stored in HTTP-only cookies in the browser that opened the demo. They are not a production account record and do not automatically sync across devices.', 'The current demo does not connect to a third-party advertising cookie or analytics service. Do not enter real personal or sensitive information into a mock profile.'] },
      { id: 'data-use', title: 'Data stored in the demo', body: ['The demo session cookie marks that a visitor has entered the demo workspace. Additional cookies hold the demo points total, a limited list of recorded swap actions and simple settings preferences. These values are used only to display the demo journey.', 'The newsletter form is not connected to a mailing-list provider. When the service is unavailable, the submitted address is not saved as a subscription.'] },
      { id: 'storage', title: 'Retention and deletion', body: ['Demo cookies have a 30-day maximum age and are cleared when you use Logout. Browser tools can also clear site cookies. Since this is not a production account system, no guarantee of cross-device backup, recovery or account export is provided.'] },
      { id: 'estimates', title: 'Environmental estimates', body: ['GreenSwap presents source-aware guidance, not professional carbon accounting. Read the Methodology page to review source organisations and uncertainty. The “0.7t saved” image is an illustrative example and is not calculated from your session.'] },
      { id: 'contact', title: 'Contact and updates', body: ['Email delivery and production account support are not configured in this demo. The privacy and data-handling text will need review and updates before a production account system is launched.'] },
    ],
  },
  terms: {
    title: 'Terms & conditions',
    description: 'Terms for using the GreenSwap preview and demo workspace.',
    code: 'LEGAL / TERMS',
    sections: [
      { id: 'overview', title: 'Preview service', body: ['GreenSwap is provided as an evolving demonstration of a sustainable-swaps product. Features, routes and content may change as the project develops. This release does not offer a production account, paid subscription or redeemable reward.'] },
      { id: 'guidance', title: 'Environmental guidance', body: ['Swap descriptions and potential benefits are informational and context-dependent. They are not a guarantee of personal savings, environmental outcome, compliance result or professional greenhouse-gas inventory. Check source notes and choose actions based on your own circumstances.'] },
      { id: 'rewards', title: 'Demo points', body: ['Green Points shown in this preview are illustrative interaction points only. They have no monetary value and cannot be transferred, redeemed or exchanged.'] },
      { id: 'availability', title: 'Availability and limitations', body: ['The demo is provided without a service-level commitment. Newsletter delivery, community posting, production authentication and payment processing are not currently connected.'] },
      { id: 'contact', title: 'Questions', body: ['The live project should be reviewed by appropriate legal counsel before real users are invited to use it as a production account or rewards service.'] },
    ],
  },
  cookies: {
    title: 'Cookie notice',
    description: 'How GreenSwap uses essential cookies in the demo workspace.',
    code: 'LEGAL / COOKIES',
    sections: [
      { id: 'overview', title: 'What is used', body: ['The public pages do not need an account. Entering the dashboard starts a mock session that is represented by an HTTP-only cookie. Other HTTP-only cookies can hold demo activity, demo points and settings.'] },
      { id: 'purpose', title: 'Why it is used', body: ['These cookies keep the demo journey connected between page requests: the dashboard can recognise the demo session, show recorded swaps and carry the points balance from exploration to activity. They are not a login to a real account.'] },
      { id: 'third-party', title: 'Third-party cookies', body: ['Third-party advertising and analytics cookies are not configured in this release. The newsletter form does not store email subscriptions when the delivery service is unavailable.'] },
      { id: 'choices', title: 'Your choices', body: ['Use the dashboard Logout link to clear the demo session cookies. You can also clear cookies for this website in your browser settings; this removes the local demo journey.'] },
      { id: 'contact', title: 'Before production', body: ['Cookie disclosures and consent flows must be reviewed against the final production features and the jurisdictions in which the service operates.'] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return { title: 'Legal page not found' };
  return { title: page.title, description: page.description };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return <section className="container-shell py-12 sm:py-16 lg:py-20">
    <p className="eyebrow">{page.code}</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-editorial sm:text-6xl">{page.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">{page.description}</p><p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted">Last updated: 11 October 2026</p>
    <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[220px,minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl border border-line bg-white p-4 lg:sticky lg:top-24"><p className="eyebrow">ON THIS PAGE</p><nav className="mt-3 space-y-1">{page.sections.map((section)=> <Link key={section.id} href={'#' + section.id} className="block rounded-lg px-2 py-2 text-xs text-muted transition hover:bg-paper hover:text-ink">{section.title}</Link>)}</nav></aside>
      <article className="min-w-0 max-w-3xl space-y-10">
        {page.sections.map((section)=> <section id={section.id} key={section.id} className="scroll-mt-28"><h2 className="font-serif text-2xl tracking-tight sm:text-3xl">{section.title}</h2>{section.body.map((paragraph,index)=> <p key={index} className="mt-4 text-sm leading-7 text-muted">{paragraph}</p>)}</section>)}
        <div className="border-t border-line pt-6 text-sm text-muted">Related pages: <Link href="/faq" className="font-semibold text-moss underline underline-offset-4">FAQ</Link> · <Link href="/methodology" className="font-semibold text-moss underline underline-offset-4">Methodology</Link></div>
      </article>
    </div>
  </section>;
}
