import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Archive, ExternalLink, Github, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onRunPipeline: () => void;
  onReset: () => void;
}

export function Navbar({ onRunPipeline, onReset }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resumeHref = `${import.meta.env.BASE_URL}Resume_TaufikAhman.pdf`;

  const scrollToEvidenceVault = () => {
    const element = document.getElementById('evidence-vault');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const openCVInNewTab = () => {
    window.open(resumeHref, '_blank');
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-sm">QA</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-foreground text-lg leading-tight">Pipeline Simulator</h1>
              <p className="text-xs text-muted-foreground">Quality Release Center</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="default" size="sm" onClick={onRunPipeline} className="shadow-sm">
              <Play size={14} className="mr-1.5" />
              Run Pipeline
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw size={14} className="mr-1.5" />
              Reset
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="sm" onClick={scrollToEvidenceVault}>
              <Archive size={14} className="mr-1.5" />
              Evidence Vault
            </Button>
            <Button variant="ghost" size="sm" onClick={openCVInNewTab}>
              <ExternalLink size={14} className="mr-1.5" />
              View CV
            </Button>
            <a href="https://github.com/taufikahman" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github size={16} />
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200',
            mobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onRunPipeline();
                setMobileMenuOpen(false);
              }}
            >
              <Play size={14} className="mr-2" />
              Run Pipeline
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onReset();
                setMobileMenuOpen(false);
              }}
            >
              <RotateCcw size={14} className="mr-2" />
              Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={scrollToEvidenceVault}>
              <Archive size={14} className="mr-2" />
              Evidence Vault
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={openCVInNewTab}>
                <ExternalLink size={14} className="mr-2" />
                View CV
              </Button>
              <a
                href="https://github.com/taufikahman"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="ghost" size="sm" className="w-full">
                  <Github size={14} className="mr-2" />
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
