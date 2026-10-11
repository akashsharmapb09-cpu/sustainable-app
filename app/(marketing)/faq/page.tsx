import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Clear answers about GreenSwap swaps, points, source data, privacy, and demo limitations.",
};

const items = [
  {
    question: "What is GreenSwap?",
    answer: "GreenSwap is a practical discovery guide to lower-impact everyday choices across home, food, travel and clothing. Browse options, try a swap that fits your life, and see the choice reflected in your demo activity.",
  },
  {
    question: "How are environmental impacts estimated?",
    answer: "The catalogue uses illustrative monthly estimates for demonstration. A production-quality estimate should state the activity unit, quantity, geography, factor year, lifecycle boundary and uncertainty. Figures on this starter are not independently verified personal savings or formal carbon accounting.",
  },
  {
    question: "Which data sources inform GreenSwap?",
    answer: "The methodology guide links to DEFRA/DESNZ greenhouse-gas conversion factors, India's Central Electricity Authority, the US Environmental Protection Agency and WRAP resources. These are useful references; the presence of a source link does not mean each demo number was computed directly from that dataset.",
  },
  {
    question: "Does a headline such as “0.7t saved” represent my personal impact?",
    answer: "No. Any headline example or social preview figure is illustrative copy, not a measurement of your behaviour. Your actual choices in this demo are not sufficient to establish audited personal savings.",
  },
  {
    question: "Do I have to create an account?",
    answer: "You can read the public pages without an account. The dashboard uses a mock demo session rather than a production identity provider. Do not use the demo as a real account or enter sensitive information.",
  },
  {
    question: "Where are completed swaps and points saved?",
    answer: "This starter stores the demo session and completed swap IDs in browser cookies so the Explore, Activity, and Account pages can show a consistent journey. The data is not synced to a database. Logging out clears the demo session and activity cookie; clearing site data also resets it.",
  },
  {
    question: "How do I change the recommendations?",
    answer: "Use the category filters and search on Explore or Catalogue to narrow the choices. The settings page demonstrates General, Notifications and Privacy controls, but those settings are currently preview state and are not synced to a backend.",
  },
  {
    question: "Are Green Points cash or redeemable rewards?",
    answer: "No. Green Points are a product concept used to illustrate progress. The rewards and Pro pages are previews only: they do not create a financial balance, issue partner offers or accept payments.",
  },
  {
    question: "Does the newsletter form send email?",
    answer: "No. The newsletter control is a UI preview. Submitting it does not send your email address to a mailing-list service. Newsletter delivery, notifications and referral rewards are not connected yet.",
  },
  {
    question: "Does “No cookies” mean GreenSwap stores no data?",
    answer: "No. This demo intentionally uses essential cookies for the mock session and completed-swap state. It does not have an analytics or advertising-cookie vendor configured. See the Privacy policy and Cookie policy for the current demo behaviour.",
  },
];

export default function FAQPage() {
  return (
    <section className="container-wide py-16 sm:py-24">
      <p className="eyebrow">Good questions · clear answers</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.065em] sm:text-7xl">A few things you might wonder.</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500">A practical guide to the sample estimates, points and features currently available in this preview.</p>
      <div className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
        {items.map((item, index) => (
          <details key={item.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-1 text-base font-semibold leading-6 marker:hidden sm:text-lg">
              <span className="flex min-w-0 gap-4"><span className="pt-0.5 font-mono text-[10px] text-gray-400">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span></span>
              <span className="shrink-0 text-xl font-normal text-gray-400 transition group-open:rotate-45" aria-hidden="true">＋</span>
            </summary>
            <p className="mt-3 max-w-2xl pl-7 text-sm leading-7 text-gray-500">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
