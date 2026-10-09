import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Badge,
  Input,
  Select,
  Modal,
  CardSkeleton,
  MetricSkeleton,
  Tabs,
  useToast,
} from '../../shared/ui';
import { PALETTE, SPACING_SCALE } from '../../shared/config/tokens';
import { formatCurrency, formatRange } from '../../shared/lib/utils';
import { ArrowRight, Sun, Moon, Bell } from 'lucide-react';

export function StyleGuidePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('components');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [inputValue, setInputValue] = useState('24.5');
  const [inputError, setInputError] = useState('');

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  const showButtonDemo = (variant: string) => {
    toast({
      title: `${variant} button works`,
      description: 'This is an interactive styleguide preview.',
      type: 'success',
    });
  };

  const tabs = [
    { id: 'components', label: 'Primitives & States' },
    { id: 'tokens', label: 'Color & Spacing Matrix' },
    { id: 'typography', label: 'Editorial Type Scale' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-background text-foreground transition-colors`}>
      {/* Masthead */}
      <header className="border-b border-border bg-surface px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="taxonomy-label border border-border px-2 py-0.5 rounded-sm">SPEC.01 / STYLEGUIDE</span>
            <h1 className="font-serif text-xl font-bold tracking-tight">
              GreenSwap Design System<span className="text-burnt">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              leftIcon={isDark ? <Sun className="h-3.5 w-3.5 text-burnt" /> : <Moon className="h-3.5 w-3.5 text-moss" />}
            >
              {isDark ? 'FIELD: DARK' : 'FIELD: LIGHT'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast({ title: 'Notification System Online', description: 'Toast messages use restrained 200ms ease animations.', type: 'success' })}
              leftIcon={<Bell className="h-3.5 w-3.5" />}
            >
              Test Toast
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <div className="mb-8">
          <p className="taxonomy-label mb-1">BOTANICAL EDITORIAL CATALOGUE</p>
          <h2 className="font-serif text-3xl font-bold md:text-4xl text-foreground">
            Living Component Guide
          </h2>
          <p className="text-xs text-ink-muted mt-1 max-w-xl font-sans">
            A comprehensive reference of human-crafted UI primitives adhering to WCAG 2.2 AA contrast standards,
            restrained motion, and zero AI template patterns.
          </p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

        {activeTab === 'components' && (
          <div className="space-y-12">
            {/* Buttons Showcase */}
            <section className="space-y-4">
              <div className="border-b border-border pb-2">
                <span className="taxonomy-label">PRIMITIVE // BUTTON VARIANTS & STATES</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={() => showButtonDemo('Primary')}>Primary (Ink)</Button>
                <Button variant="secondary" onClick={() => showButtonDemo('Secondary')}>Secondary (Bone)</Button>
                <Button variant="accent" onClick={() => showButtonDemo('Accent')}>Accent (Burnt)</Button>
                <Button variant="outline" onClick={() => showButtonDemo('Outline')}>Outline</Button>
                <Button variant="ghost" onClick={() => showButtonDemo('Ghost')}>Ghost</Button>
                <Button
                  variant="destructive"
                  onClick={() => toast({
                    title: 'Destructive button preview',
                    description: 'This demo does not delete or change any data.',
                    type: 'warning',
                  })}
                >
                  Destructive
                </Button>
                <Button variant="primary" isLoading aria-label="Loading button example">Loading</Button>
                <Button variant="primary" disabled aria-label="Disabled button example">Disabled</Button>
                <Button
                  variant="secondary"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  onClick={() => showButtonDemo('With icon')}
                >
                  With Icon
                </Button>
              </div>
            </section>

            {/* Badges & Taxonomy Stamps */}
            <section className="space-y-4">
              <div className="border-b border-border pb-2">
                <span className="taxonomy-label">PRIMITIVE // TAXONOMY STAMPS & BADGES</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default">DEFAULT BADGE</Badge>
                <Badge variant="moss">MOSS / HIGH IMPACT</Badge>
                <Badge variant="clay">CLAY / MODERATE</Badge>
                <Badge variant="burnt">BURNT / COMMITTED</Badge>
                <Badge variant="outline">OUTLINE RULE</Badge>
                <Badge variant="subtle">SUBTLE TAXONOMY</Badge>
              </div>
            </section>

            {/* Form Inputs */}
            <section className="space-y-4">
              <div className="border-b border-border pb-2">
                <span className="taxonomy-label">PRIMITIVE // FORM CONTROLS & NUMERICS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Quantity / Distance"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  unitSuffix="km / day"
                  hint="Enter your daily one-way commute distance"
                />

                <Input
                  label="Validated Field"
                  value="invalid@"
                  error={inputError || 'Please provide a valid metric integer'}
                  onChange={() => setInputError('Input exceeds maximum threshold')}
                />

                <Select
                  label="Category Taxonomy"
                  options={[
                    { label: 'Transport (Commute & Transit)', value: 'transport' },
                    { label: 'Energy (Household & Appliances)', value: 'energy' },
                    { label: 'Food (Diet & Staples)', value: 'food' },
                    { label: 'Shopping (Circularity & Goods)', value: 'shopping' },
                    { label: 'Waste (Composting & Single-Use)', value: 'waste' },
                  ]}
                />
              </div>
            </section>

            {/* Specimen Cards */}
            <section className="space-y-4">
              <div className="border-b border-border pb-2">
                <span className="taxonomy-label">PRIMITIVE // SPECIMEN PLATE CARDS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card taxonomyCode="SPECIMEN #01 // TRNS-METRO" badge={<Badge variant="moss">91% REDUCTION</Badge>}>
                  <CardHeader>
                    <CardTitle>Switch Commute to Metro Transit</CardTitle>
                    <CardDescription>
                      Replace private car commute with rapid electrified urban transit.
                    </CardDescription>
                  </CardHeader>
                  <div className="space-y-2 text-xs font-mono">
                    <p className="text-ink-muted">
                      CO2e Mitigation: <strong className="text-foreground">{formatRange(45.2, 58.6, 'kg/mo')}</strong>
                    </p>
                    <p className="text-ink-muted">
                      Cost Delta: <strong className="text-moss">{formatCurrency(-3200, 'INR')}</strong> net savings
                    </p>
                  </div>
                  <CardFooter>
                    <span className="taxonomy-label">DMRC 2023 / DEFRA 2024</span>
                    <Button variant="accent" size="sm" onClick={() => setIsModalOpen(true)}>
                      Adopt Alternative
                    </Button>
                  </CardFooter>
                </Card>

                <Card taxonomyCode="MODAL INTERACTION // DIALOG TEST">
                  <CardHeader>
                    <CardTitle>Accessible Dialog Primitive</CardTitle>
                    <CardDescription>
                      Supports focus trapping, background blur, and ESC key listener.
                    </CardDescription>
                  </CardHeader>
                  <div className="py-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                      Open Specimen Modal
                    </Button>
                  </div>
                </Card>
              </div>
            </section>

            {/* Skeletons */}
            <section className="space-y-4">
              <div className="border-b border-border pb-2">
                <span className="taxonomy-label">PRIMITIVE // RESTRAINED LOADING SKELETONS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-8">
            <section className="border border-border bg-surface p-6 rounded">
              <h3 className="font-serif text-xl font-bold mb-4">Color Palette & Contrast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-border p-4 rounded-sm bg-bone-100 dark:bg-surface-muted">
                  <div className="h-14 rounded-sm mb-3 bg-[#33593A] border border-border" />
                  <p className="font-serif font-bold text-sm">Moss (Botanical)</p>
                  <p className="font-mono text-xs text-ink-muted">{PALETTE.moss.primary}</p>
                </div>
                <div className="border border-border p-4 rounded-sm bg-bone-100 dark:bg-surface-muted">
                  <div className="h-14 rounded-sm mb-3 bg-[#A35A38] border border-border" />
                  <p className="font-serif font-bold text-sm">Clay (Terracotta)</p>
                  <p className="font-mono text-xs text-ink-muted">{PALETTE.clay.primary}</p>
                </div>
                <div className="border border-border p-4 rounded-sm bg-bone-100 dark:bg-surface-muted">
                  <div className="h-14 rounded-sm mb-3 bg-[#C84B26] border border-border" />
                  <p className="font-serif font-bold text-sm">Burnt Orange (Accent)</p>
                  <p className="font-mono text-xs text-ink-muted">{PALETTE.burntOrange.accent}</p>
                </div>
              </div>
            </section>

            <section className="border border-border bg-surface p-6 rounded">
              <h3 className="font-serif text-xl font-bold mb-4">Spacing Harmonic Scale (4px Base Grid)</h3>
              <div className="flex flex-wrap gap-2">
                {SPACING_SCALE.map((step) => (
                  <div key={step} className="border border-border p-3 text-center rounded-sm bg-surface-muted/40">
                    <span className="font-mono text-sm font-bold block">{step}px</span>
                    <span className="taxonomy-label text-[10px]">STEP {step}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'typography' && (
          <section className="border border-border bg-surface p-8 rounded space-y-6">
            <h3 className="font-serif text-xl font-bold border-b border-border pb-3">Typography Pairing Specimen</h3>
            <div className="space-y-4">
              <div>
                <span className="taxonomy-label">DISPLAY 4XL // FRAUNCES SERIF</span>
                <p className="font-serif text-4xl font-bold tracking-tight mt-1">
                  Preserving ecological integrity through honest accounting.
                </p>
              </div>

              <div>
                <span className="taxonomy-label">HEADING 2XL // FRAUNCES SERIF</span>
                <p className="font-serif text-2xl font-semibold tracking-tight mt-1">
                  Pragmatic alternatives to everyday carbon drivers.
                </p>
              </div>

              <div>
                <span className="taxonomy-label">UI & BODY // DM SANS</span>
                <p className="font-sans text-sm text-ink-muted max-w-2xl leading-relaxed mt-1">
                  Every metric in GreenSwap is computed using localized emissions databases (DEFRA, CEA India,
                  IPCC AR6) and rendered as honest ranges with explicit confidence intervals.
                </p>
              </div>

              <div>
                <span className="taxonomy-label">DATA & NUMERICS // JETBRAINS MONO TABULAR</span>
                <p className="tabular-nums text-lg font-mono font-semibold text-foreground mt-1">
                  SAVED: 45.2 – 58.6 kg CO2e/mo | NET: -₹3,200/mo | CERTAINTY: ±10%
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Interactive Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Botanical Specimen Record"
        taxonomyCode="MODAL // SPEC-042"
        description="Detailed life-cycle assessment parameters and references."
      >
        <div className="space-y-4 text-xs font-sans">
          <p className="text-ink-muted leading-relaxed">
            This modal is fully accessible, traps focus automatically, closes on the Escape key,
            and restores focus to the invoking trigger upon dismissal.
          </p>
          <div className="rounded border border-border p-3 bg-surface-muted font-mono text-[11px]">
            LCA Source: Central Electricity Authority India (CO2 Baseline Database v19, 2023)
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="accent" size="sm" onClick={() => { setIsModalOpen(false); toast({ title: 'Specimen verified', type: 'success' }); }}>
              Acknowledge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
