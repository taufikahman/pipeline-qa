import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Stage, OutcomeConfig, StageOutcome } from '@/types/pipeline';
import { Play, Info } from 'lucide-react';

interface RunPipelineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stages: Stage[];
  onStartRun: (outcomes: StageOutcome[]) => void;
}

export function RunPipelineModal({
  open,
  onOpenChange,
  stages,
  onStartRun,
}: RunPipelineModalProps) {
  const [outcomes, setOutcomes] = useState<Record<string, OutcomeConfig>>(() =>
    stages.reduce((acc, stage) => ({ ...acc, [stage.id]: 'AUTO' as OutcomeConfig }), {})
  );

  const handleOutcomeChange = (stageId: string, outcome: OutcomeConfig) => {
    setOutcomes((prev) => ({ ...prev, [stageId]: outcome }));
  };

  const handleStartRun = () => {
    const stageOutcomes: StageOutcome[] = stages.map((stage) => ({
      stageId: stage.id,
      outcome: outcomes[stage.id],
    }));
    onStartRun(stageOutcomes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Run Pipeline</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose PASS/FAIL per stage to simulate different release outcomes.
          </p>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-[1fr,80px,130px] gap-4 pb-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Stage</span>
            <span>Type</span>
            <span>Outcome</span>
          </div>

          <div className="divide-y divide-border">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="grid grid-cols-[1fr,80px,130px] gap-4 py-3.5 items-center"
              >
                <span className="text-sm font-medium text-foreground">{stage.name}</span>
                <span className="text-xs text-muted-foreground font-medium">{stage.type}</span>
                <Select
                  value={outcomes[stage.id]}
                  onValueChange={(value) =>
                    handleOutcomeChange(stage.id, value as OutcomeConfig)
                  }
                >
                  <SelectTrigger className="h-9 bg-muted border-border text-foreground rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    <SelectItem value="AUTO">AUTO</SelectItem>
                    <SelectItem value="PASS">PASS</SelectItem>
                    <SelectItem value="FAIL">FAIL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
          <Info size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Set <span className="font-semibold text-foreground">Smoke</span> or{' '}
            <span className="font-semibold text-foreground">API</span> to FAIL to see the Quality Gate block
            the release.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleStartRun} className="rounded-xl shadow-md">
            <Play size={14} className="mr-1.5" />
            Start Run
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
