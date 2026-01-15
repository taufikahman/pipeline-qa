import { Stage } from '@/types/pipeline';
import { StageCard } from './StageCard';
import { StatusBadge } from './StatusBadge';
import { GitBranch, History } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PipelineSimulatorProps {
  stages: Stage[];
  releaseStatus: 'pending' | 'passed' | 'blocked';
  selectedStageId: string | null;
  onStageSelect: (stageId: string) => void;
  isViewingHistory?: boolean;
  historyDate?: Date;
}

export function PipelineSimulator({
  stages,
  releaseStatus,
  selectedStageId,
  onStageSelect,
  isViewingHistory = false,
  historyDate,
}: PipelineSimulatorProps) {
  const getReleaseMessage = () => {
    if (isViewingHistory) {
      return historyDate 
        ? `From ${format(new Date(historyDate), 'PPp')}`
        : 'Viewing historical report';
    }
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
    <div className={cn(
      "bg-card border rounded-2xl p-6 shadow-sm transition-colors",
      isViewingHistory 
        ? "border-amber-500/50 bg-amber-500/5" 
        : "border-border"
    )}>
      {/* History Banner */}
      {isViewingHistory && (
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg px-3 py-2 mb-4 text-sm">
          <History size={16} />
          <span className="font-medium">Viewing Historical Report</span>
          {historyDate && (
            <span className="text-amber-600/70 dark:text-amber-400/70">
              — {format(new Date(historyDate), 'PPpp')}
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isViewingHistory ? "bg-amber-500/10" : "bg-primary/10"
          )}>
            {isViewingHistory ? (
              <History className="text-amber-500" size={20} />
            ) : (
              <GitBranch className="text-primary" size={20} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              {isViewingHistory ? 'Pipeline History' : 'CI Pipeline'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isViewingHistory 
                ? 'Click on Report History below to switch reports'
                : 'Click a stage to view logs and evidence'}
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
        {stages.length > 0 ? (
          stages.map((stage, index) => (
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
          ))
        ) : isViewingHistory ? (
          <div className="border border-dashed border-amber-500/30 rounded-xl p-6 text-center bg-amber-500/5">
            <History className="mx-auto text-amber-500/50 mb-3" size={32} />
            <p className="text-sm font-medium text-foreground mb-1">
              Stage details tidak tersedia
            </p>
            <p className="text-xs text-muted-foreground">
              Report ini disimpan sebelum fitur detail stages ditambahkan.
              <br />
              Jalankan pipeline baru untuk melihat detail stages.
            </p>
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl p-6 text-center">
            <GitBranch className="mx-auto text-muted-foreground/50 mb-3" size={32} />
            <p className="text-sm text-muted-foreground">
              Klik "Run Pipeline" untuk memulai
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
