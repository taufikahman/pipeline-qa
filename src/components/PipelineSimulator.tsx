import { Stage } from '@/types/pipeline';
import { StageCard } from './StageCard';
import { StatusBadge } from './StatusBadge';
import { GitBranch } from 'lucide-react';

interface PipelineSimulatorProps {
  stages: Stage[];
  releaseStatus: 'pending' | 'passed' | 'blocked';
  selectedStageId: string | null;
  onStageSelect: (stageId: string) => void;
}

export function PipelineSimulator({
  stages,
  releaseStatus,
  selectedStageId,
  onStageSelect,
}: PipelineSimulatorProps) {
  const getReleaseMessage = () => {
    switch (releaseStatus) {
      case 'passed':
        return 'All checks passed. Ready to release.';
      case 'blocked':
        return 'Quality Gate failed. Fix & re-run.';
      default:
        return 'Click "Run Pipeline" to start.';
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <GitBranch className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              CI Pipeline Simulator
            </h2>
            <p className="text-sm text-muted-foreground">
              Click a stage to view logs and evidence
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Release</p>
          <StatusBadge
            status={
              releaseStatus === 'passed'
                ? 'passed'
                : releaseStatus === 'blocked'
                ? 'blocked'
                : 'pending'
            }
          />
          <p className="text-xs text-muted-foreground mt-2 max-w-[160px]">
            {getReleaseMessage()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative">
            {index > 0 && (
              <div className="absolute left-[27px] -top-3 w-0.5 h-3 bg-border" />
            )}
            <StageCard
              stage={stage}
              isSelected={selectedStageId === stage.id}
              onClick={() => onStageSelect(stage.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
