import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Archive, Download, Github } from 'lucide-react';

interface HeaderProps {
  onRunPipeline: () => void;
  onReset: () => void;
}

export function Header({ onRunPipeline, onReset }: HeaderProps) {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Portfolio · Quality Release Center
          </p>
          <h1 className="text-3xl font-bold text-foreground mb-2">Firaga Pratama</h1>
          <p className="text-muted-foreground mb-3">
            QA Engineer — <span className="text-foreground">Playwright</span> ·{' '}
            <span className="text-foreground">Postman</span> ·{' '}
            <span className="text-foreground">k6</span>
          </p>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            I build <span className="text-foreground font-medium">release confidence</span>{' '}
            through risk-based testing, stable automation, and audit-ready evidence
            (reports, artifacts, and quality gates).
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={onRunPipeline}>
            <Play size={14} className="mr-2" />
            Run Pipeline
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw size={14} className="mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm">
            <Archive size={14} className="mr-2" />
            Open Evidence Vault
          </Button>
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-2" />
            Download CV
          </Button>
          <Button variant="outline" size="sm">
            <Github size={14} className="mr-2" />
            GitHub
          </Button>
        </div>
      </div>
    </header>
  );
}
