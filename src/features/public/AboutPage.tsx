import { PublicFooter, PublicMasthead } from './PublicMasthead';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicMasthead />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        <p className="taxonomy-label mb-2">ABOUT</p>
        <h1 className="font-serif text-4xl font-semibold mb-4">A field guide, not a sermon.</h1>
        <p className="text-ink-muted leading-relaxed">
          GreenSwap ranks household alternatives with published emission factors, explicit uncertainty
          ranges, and rupee deltas. The ranking engine is deterministic TypeScript — the same formula
          on every run.
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
