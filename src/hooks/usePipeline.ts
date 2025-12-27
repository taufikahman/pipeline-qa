import { useState, useCallback } from 'react';
import { Stage, StageOutcome, StageStatus } from '@/types/pipeline';
import { initialStages, getPassedLogs, getFailedLogs } from '@/data/pipelineData';

export function usePipeline() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [releaseStatus, setReleaseStatus] = useState<'pending' | 'passed' | 'blocked'>('pending');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runPipeline = useCallback(async (outcomes: StageOutcome[]) => {
    setIsRunning(true);
    setSelectedStageId(null);

    // Set stages to running only if not skipped
    setStages((prev) =>
      prev.map((stage) => {
        const outcome = outcomes.find(o => o.stageId === stage.id);
        if (outcome?.outcome === 'SKIP') {
          return { ...stage, status: 'pending' as StageStatus };
        }
        return { ...stage, status: 'running' as StageStatus };
      })
    );

    // Process each stage with a delay for animation
    let allPassed = true;
    let hasRunningStages = false;

    for (let i = 0; i < outcomes.length; i++) {
      const { stageId, outcome } = outcomes[i];
      
      // Skip stages marked as SKIP
      if (outcome === 'SKIP') {
        continue;
      }

      hasRunningStages = true;
      await new Promise((resolve) => setTimeout(resolve, 500));

      let finalStatus: StageStatus;
      
      if (outcome === 'PASS') {
        finalStatus = 'passed';
      } else if (outcome === 'FAIL') {
        finalStatus = 'failed';
        allPassed = false;
      } else {
        // AUTO: Use predefined outcomes (API and UI fail by default for demo)
        if (stageId === 'api-tests' || stageId === 'ui-e2e') {
          finalStatus = 'failed';
          allPassed = false;
        } else {
          finalStatus = 'passed';
        }
      }

      // Quality gate depends on previous stages
      if (stageId === 'quality-gate') {
        finalStatus = allPassed ? 'passed' : 'failed';
      }

      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id === stageId) {
            return {
              ...stage,
              status: finalStatus,
              logs: finalStatus === 'passed' ? getPassedLogs(stageId) : getFailedLogs(stageId),
              triageNote: finalStatus === 'failed' ? stage.triageNote : undefined,
            };
          }
          return stage;
        })
      );

      // Auto-select the first failed stage or the last stage
      if (finalStatus === 'failed' && !selectedStageId) {
        setSelectedStageId(stageId);
      }
    }

    if (hasRunningStages) {
      setReleaseStatus(allPassed ? 'passed' : 'blocked');
    }
    setIsRunning(false);

    // If nothing selected, select quality gate
    setSelectedStageId((prev) => prev || 'quality-gate');
  }, []);

  const resetPipeline = useCallback(() => {
    setStages(initialStages);
    setReleaseStatus('pending');
    setSelectedStageId(null);
    setIsRunning(false);
  }, []);

  const selectStage = useCallback((stageId: string) => {
    setSelectedStageId(stageId);
  }, []);

  const selectedStage = stages.find((s) => s.id === selectedStageId) || null;

  return {
    stages,
    releaseStatus,
    selectedStageId,
    selectedStage,
    isRunning,
    runPipeline,
    resetPipeline,
    selectStage,
  };
}
