import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProfileHero } from '@/components/ProfileHero';
import { PipelineSimulator } from '@/components/PipelineSimulator';
import { StageDetails } from '@/components/StageDetails';
import { RunPipelineModal } from '@/components/RunPipelineModal';
import { OutputReport } from '@/components/OutputReport';
import { EvidenceVault } from '@/components/EvidenceVault';
import { usePipeline } from '@/hooks/usePipeline';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    stages,
    releaseStatus,
    selectedStageId,
    selectedStage,
    runPipeline,
    resetPipeline,
    selectStage,
  } = usePipeline();

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

        <OutputReport stages={stages} releaseStatus={releaseStatus} />
        
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
