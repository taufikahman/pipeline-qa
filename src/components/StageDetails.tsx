import { Stage } from '@/types/pipeline';
import { StatusBadge } from './StatusBadge';
import { ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageDetailsProps {
  stage: Stage | null;
}

export function StageDetails({ stage }: StageDetailsProps) {
  if (!stage) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          Click a stage to view logs and evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-slide-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Stage Details</h2>
          <p className="text-muted-foreground">{stage.name}</p>
        </div>
        <StatusBadge status={stage.status} />
      </div>

      {/* Logs Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Logs</h3>
        <div className="bg-background rounded-lg p-4 border border-border font-mono text-sm space-y-1 max-h-48 overflow-y-auto">
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
          <h3 className="text-sm font-medium text-foreground mb-3">Triage note</h3>
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {stage.triageNote}
            </p>
          </div>
        </div>
      )}

      {/* Artifacts */}
      {stage.artifacts && stage.artifacts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Artifacts</h3>
          <div className="space-y-2">
            {stage.artifacts.map((artifact, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-background rounded-lg p-3 border border-border hover:border-muted-foreground/30 transition-colors cursor-pointer"
              >
                <span className="text-sm text-foreground">{artifact.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
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
