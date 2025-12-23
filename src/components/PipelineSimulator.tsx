import { Stage } from '@/types/pipeline';
import { StageCard } from './StageCard';
import { StatusBadge } from './StatusBadge';

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
        return 'Click "Run Pipeline" to start simulation.';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            CI Pipeline Simulator
          </h2>
          <p className="text-sm text-muted-foreground">
            Click a stage to view logs and evidence. The Quality Gate determines the
            release decision.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-2">Release</p>
          <StatusBadge
            status={
              releaseStatus === 'passed'
                ? 'passed'
                : releaseStatus === 'blocked'
                ? 'blocked'
                : 'pending'
            }
          />
          <p className="text-xs text-muted-foreground mt-2 max-w-[180px]">
            {getReleaseMessage()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isSelected={selectedStageId === stage.id}
            onClick={() => onStageSelect(stage.id)}
          />
        ))}
      </div>
    </div>
  );
}
