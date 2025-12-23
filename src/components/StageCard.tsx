import { Stage } from '@/types/pipeline';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface StageCardProps {
  stage: Stage;
  isSelected: boolean;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  STATIC: 'text-stage-static',
  MANUAL: 'text-stage-manual',
  API: 'text-stage-api',
  UI: 'text-stage-ui',
  PERF: 'text-stage-perf',
  GATE: 'text-stage-gate',
};

export function StageCard({ stage, isSelected, onClick }: StageCardProps) {
  return (
    <div
      className={cn('stage-card animate-fade-in', { selected: isSelected })}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{stage.name}</h3>
            <span className={cn('text-xs font-medium', typeColors[stage.type])}>
              · {stage.type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {stage.description}
          </p>
        </div>
        <StatusBadge status={stage.status} />
      </div>
    </div>
  );
}
