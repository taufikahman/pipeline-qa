import { useState, useCallback } from 'react';
import { Stage, StageOutcome, StageStatus, LogEntry } from '@/types/pipeline';
import { initialStages, getPassedLogs, getFailedLogs } from '@/data/pipelineData';
import { runPipeline as runPipelineApi } from '@/lib/api';

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

    // Check if smoke-tests or ui-e2e is AUTO - trigger Playwright
    const smokeOutcome = outcomes.find(o => o.stageId === 'smoke-tests');
    const uiE2eOutcome = outcomes.find(o => o.stageId === 'ui-e2e');
    const shouldRunPlaywright = 
      (smokeOutcome?.outcome === 'AUTO' && smokeOutcome.outcome !== 'SKIP') ||
      (uiE2eOutcome?.outcome === 'AUTO' && uiE2eOutcome.outcome !== 'SKIP');

    let playwrightResult: { passed: boolean; logs: LogEntry[] } | null = null;

    // Run Playwright tests if needed
    if (shouldRunPlaywright) {
      try {
        console.log('🎭 Running Playwright tests...');
        
        // Update UI to show Playwright is running
        setStages((prev) =>
          prev.map((stage) => {
            if (stage.id === 'smoke-tests' || stage.id === 'ui-e2e') {
              return {
                ...stage,
                logs: [
                  { prefix: '[playwright]', message: '🎭 Connecting to Playwright server...', type: 'normal' as const },
                  { prefix: '[playwright]', message: 'Running automated tests...', type: 'normal' as const },
                ],
              };
            }
            return stage;
          })
        );

        const response = await runPipelineApi();
        
        if (response.success) {
          const testResults = response.data.testResults;
          const passed = testResults.status === 'SUCCESS';
          
          playwrightResult = {
            passed,
            logs: [
              { prefix: '[playwright]', message: '🎭 Playwright tests completed', type: 'normal' as const },
              { prefix: '[playwright]', message: `Browser: chromium`, type: 'normal' as const },
              { prefix: '[playwright]', message: `Total tests: ${testResults.total}`, type: 'normal' as const },
              { prefix: '[playwright]', message: `Passed: ${testResults.passed}`, type: passed ? 'success' as const : 'normal' as const },
              { prefix: '[playwright]', message: `Failed: ${testResults.failed}`, type: testResults.failed > 0 ? 'error' as const : 'normal' as const },
              { prefix: '[playwright]', message: `Pass rate: ${testResults.pass_rate}%`, type: passed ? 'success' as const : 'warning' as const },
              { prefix: '[playwright]', message: passed ? '✅ All tests passed!' : '❌ Some tests failed', type: passed ? 'success' as const : 'error' as const },
            ],
          };
          
          console.log('✅ Playwright tests completed:', testResults);
        }
      } catch (error) {
        console.error('❌ Playwright tests failed:', error);
        playwrightResult = {
          passed: false,
          logs: [
            { prefix: '[playwright]', message: '🎭 Running Playwright tests...', type: 'normal' as const },
            { prefix: '[playwright]', message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' as const },
            { prefix: '[playwright]', message: 'Tests could not be completed', type: 'error' as const },
          ],
        };
      }
    }

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
      let stageLogs: LogEntry[] | undefined;
      
      if (outcome === 'PASS') {
        finalStatus = 'passed';
      } else if (outcome === 'FAIL') {
        finalStatus = 'failed';
        allPassed = false;
      } else {
        // AUTO: Check Playwright results for smoke-tests and ui-e2e
        if ((stageId === 'smoke-tests' || stageId === 'ui-e2e') && playwrightResult) {
          finalStatus = playwrightResult.passed ? 'passed' : 'failed';
          stageLogs = playwrightResult.logs;
          if (!playwrightResult.passed) {
            allPassed = false;
          }
        } else if (stageId === 'api-tests') {
          // API tests still use default behavior (fail by default for demo)
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
              logs: stageLogs || (finalStatus === 'passed' ? getPassedLogs(stageId) : getFailedLogs(stageId)),
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
