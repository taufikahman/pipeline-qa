import { Stage } from '@/types/pipeline';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface StageCardProps {
  stage: Stage;
  isSelected: boolean;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  STATIC: 'text-stage-static bg-stage-static/10',
  MANUAL: 'text-stage-manual bg-stage-manual/10',
  API: 'text-stage-api bg-stage-api/10',
  UI: 'text-stage-ui bg-stage-ui/10',
  PERF: 'text-stage-perf bg-stage-perf/10',
  GATE: 'text-stage-gate bg-stage-gate/10',
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'passed':
      return <CheckCircle2 size={18} className="text-status-passed" />;
    case 'failed':
      return <XCircle size={18} className="text-status-failed" />;
    case 'running':
      return <Loader2 size={18} className="text-status-running animate-spin" />;
    default:
      return <Clock size={18} className="text-muted-foreground" />;
  }
};

export function StageCard({ stage, isSelected, onClick }: StageCardProps) {
  return (
    <div
      className={cn('stage-card animate-fade-in', { selected: isSelected })}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5">
            <StatusIcon status={stage.status} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="font-semibold text-foreground">{stage.name}</h3>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', typeColors[stage.type])}>
                {stage.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {stage.description}
            </p>
          </div>
        </div>
        <StatusBadge status={stage.status} />
      </div>
    </div>
  );
}
