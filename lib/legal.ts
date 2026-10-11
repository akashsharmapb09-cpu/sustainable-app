type LegalSection = { title: string; body: string };
type LegalPage = { title: string; description: string; updated: string; sections: LegalSection[] };

const privacyPolicy: LegalPage = {
  title: "Privacy policy",
  description: "How the current GreenSwap demo handles browser-stored preferences and activity.",
  updated: "October 11, 2026",
  sections: [
    { title: "Information handled by the demo", body: "The demo uses a short-lived cookie to protect dashboard routes and a separate cookie to remember which sample swaps you have marked as tried. It does not have a configured account database or cloud sync in this version. Avoid entering sensitive personal information." },
    { title: "How information is used", body: "The demo cookie opens the sample dashboard, and selected swap IDs are used to render your activity and points summary. Impact figures remain illustrative estimates. They are not used as verified personal environmental measurements." },
    { title: "Newsletter and third parties", body: "Newsletter signup is currently a UI preview; it does not send your email to a mailing provider. The pages use optimised Unsplash images for sample photography. No analytics vendor is configured by this starter." },
    { title: "Your choices and retention", body: "You can leave the demo with Log out, which clears the demo session and completed-swap cookie. You can also clear site cookies and data in your browser. A future production release should describe actual processors, retention periods, contact details and user rights after its backend is configured." },
  ],
};

export const legalPages: Record<string, LegalPage> = {
  "privacy-policy": privacyPolicy,
  terms: {
    title: "Terms & conditions",
    description: "Terms for using the GreenSwap preview.",
    updated: "October 11, 2026",
    sections: [
      { title: "Using GreenSwap", body: "Use the website lawfully and respectfully. You are responsible for deciding whether an idea is suitable for your location, needs, budget and circumstances." },
      { title: "Impact estimates and rewards", body: "Carbon and cost figures in this preview are illustrative estimates, not guarantees or professional greenhouse-gas accounting. Green Points are a demo mechanic, not money or a redeemable entitlement." },
      { title: "Availability and features", body: "The newsletter, account backend, cloud sync, Pro payments and partner reward redemption are not enabled in this demo. Do not treat preview controls as completed commercial transactions." },
    ],
  },
  cookies: {
    title: "Cookie policy",
    description: "What the GreenSwap demo stores in your browser.",
    updated: "October 11, 2026",
    sections: [
      { title: "Demo session", body: "The mock dashboard session uses a cookie to allow access to /dashboard routes. It expires after seven days or when you choose Log out." },
      { title: "Activity state", body: "The demo stores completed swap IDs in a separate cookie so activity and account pages can render the same choices. Logging out clears that cookie." },
      { title: "Analytics and advertising", body: "No analytics or third-party advertising-cookie vendor is configured in this preview. If these features are added, this notice and the consent experience must be reviewed." },
    ],
  },
};
