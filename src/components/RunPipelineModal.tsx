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
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Run Pipeline</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose PASS/FAIL per stage to simulate different release outcomes.
          </p>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-[1fr,80px,120px] gap-4 pb-3 border-b border-border text-sm font-medium text-muted-foreground">
            <span>Stage</span>
            <span>Type</span>
            <span>Outcome</span>
          </div>

          <div className="divide-y divide-border">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="grid grid-cols-[1fr,80px,120px] gap-4 py-3 items-center"
              >
                <span className="text-sm text-foreground">{stage.name}</span>
                <span className="text-xs text-muted-foreground">{stage.type}</span>
                <Select
                  value={outcomes[stage.id]}
                  onValueChange={(value) =>
                    handleOutcomeChange(stage.id, value as OutcomeConfig)
                  }
                >
                  <SelectTrigger className="h-8 bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="AUTO">AUTO</SelectItem>
                    <SelectItem value="PASS">PASS</SelectItem>
                    <SelectItem value="FAIL">FAIL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Tip: set <span className="font-semibold">Smoke</span> or{' '}
          <span className="font-semibold">API</span> to FAIL to see the Quality Gate block
          the release.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartRun}>Start Run</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
