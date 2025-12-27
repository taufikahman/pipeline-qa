import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProfileHero } from '@/components/ProfileHero';
import { PipelineSimulator } from '@/components/PipelineSimulator';
import { StageDetails } from '@/components/StageDetails';
import { RunPipelineModal } from '@/components/RunPipelineModal';
import { OutputReport } from '@/components/OutputReport';
import { EvidenceVault } from '@/components/EvidenceVault';
import { usePipeline } from '@/hooks/usePipeline';
import { usePipelineReports } from '@/hooks/usePipelineReports';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    stages,
    releaseStatus,
    selectedStageId,
    selectedStage,
    isRunning,
    runPipeline,
    resetPipeline,
    selectStage,
  } = usePipeline();

  const { reports, saveReport } = usePipelineReports();

  // Save report when pipeline finishes running
  useEffect(() => {
    if (!isRunning && stages.some(s => s.status !== 'pending')) {
      const hasNewRun = stages.some(s => s.status === 'passed' || s.status === 'failed');
      if (hasNewRun && (reports.length === 0 || reports[0]?.stages !== stages)) {
        saveReport(stages, releaseStatus);
      }
    }
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onRunPipeline={() => setIsModalOpen(true)} onReset={resetPipeline} />

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <ProfileHero />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <PipelineSimulator
              stages={stages}
              releaseStatus={releaseStatus}
              selectedStageId={selectedStageId}
              onStageSelect={selectStage}
            />
          </div>
          <div className="lg:col-span-2">
            <StageDetails stage={selectedStage} />
          </div>
        </div>

        <OutputReport 
          stages={stages} 
          releaseStatus={releaseStatus}
          reports={reports}
        />
        
        <EvidenceVault />
      </main>

      <RunPipelineModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        stages={stages}
        onStartRun={runPipeline}
      />
    </div>
  );
};

export default Index;
