import { Sparkles } from 'lucide-react';

export function ProfileHero() {
  return (
    <section className="mb-8 animate-fade-in">
      <div className="bg-gradient-to-br from-primary/5 via-card to-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shrink-0">
            <Sparkles className="text-primary-foreground" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Firaga Pratama
            </h1>
            <p className="text-muted-foreground mb-3">
              QA Engineer — <span className="text-primary font-medium">Playwright</span> ·{' '}
              <span className="text-stage-api font-medium">Postman</span> ·{' '}
              <span className="text-stage-perf font-medium">k6</span>
            </p>
            <p className="text-muted-foreground max-w-2xl leading-relaxed text-sm md:text-base">
              I build <span className="text-foreground font-semibold">release confidence</span>{' '}
              through risk-based testing, stable automation, and audit-ready evidence
              (reports, artifacts, and quality gates).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
