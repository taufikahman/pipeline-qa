import { Stage } from '@/types/pipeline';
import { StatusBadge } from './StatusBadge';
import { ExternalLink, FileText, ClipboardList, ScrollText, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageDetailsProps {
  stage: Stage | null;
}

export function StageDetails({ stage }: StageDetailsProps) {
  if (!stage) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col items-center justify-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <ClipboardList className="text-muted-foreground" size={28} />
        </div>
        <p className="text-muted-foreground text-center font-medium">
          Click a stage to view logs and evidence
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-slide-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Stage Details</p>
          <h2 className="text-lg font-semibold text-foreground">{stage.name}</h2>
        </div>
        <StatusBadge status={stage.status} />
      </div>

      {/* Logs Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ScrollText size={14} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Logs</h3>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 border border-border font-mono text-sm space-y-1 max-h-48 overflow-y-auto">
          {stage.logs.map((log, index) => (
            <div key={index} className="log-line">
              <span className="log-prefix">{log.prefix}</span>{' '}
              <span
                className={cn({
                  'log-success': log.type === 'success',
                  'log-error': log.type === 'error',
                  'log-warning': log.type === 'warning',
                  'text-foreground': log.type === 'normal',
                })}
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Triage Note */}
      {stage.triageNote && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Triage note</h3>
          </div>
          <div className="bg-status-blocked/5 rounded-xl p-4 border border-status-blocked/20">
            <p className="text-sm text-foreground leading-relaxed">
              {stage.triageNote}
            </p>
          </div>
        </div>
      )}

      {/* Artifacts */}
      {stage.artifacts && stage.artifacts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Artifacts</h3>
          </div>
          <div className="space-y-2">
            {stage.artifacts.map((artifact, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted/50 rounded-xl p-3.5 border border-border hover:border-primary/30 hover:bg-muted transition-colors cursor-pointer group"
              >
                <span className="text-sm font-medium text-foreground">{artifact.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  {artifact.type === 'link' ? (
                    <>
                      <ExternalLink size={12} />
                      link
                    </>
                  ) : (
                    <>
                      <FileText size={12} />
                      report
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
