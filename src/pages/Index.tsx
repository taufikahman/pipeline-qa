import { useState, useEffect, useMemo } from 'react';
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
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const {
    stages,
    releaseStatus,
    selectedStageId,
    isRunning,
    runPipeline,
    resetPipeline,
    selectStage,
  } = usePipeline();

  const { reports, saveReport, isLoading: isLoadingReports } = usePipelineReports();

  // Get the selected report from history
  const selectedReport = useMemo(() => {
    if (!selectedReportId) return null;
    return reports.find(r => r.id === selectedReportId) || null;
  }, [selectedReportId, reports]);

  // Determine which stages and status to display
  const displayStages = selectedReport ? selectedReport.stages : stages;
  const displayReleaseStatus = selectedReport ? selectedReport.releaseStatus : releaseStatus;

  // Find selected stage from display stages
  const displaySelectedStage = useMemo(() => {
    if (!selectedStageId) return null;
    return displayStages.find(s => s.id === selectedStageId) || null;
  }, [selectedStageId, displayStages]);

  // Handle report selection
  const handleSelectReport = (reportId: string | null) => {
    setSelectedReportId(reportId);
    // Clear stage selection when switching reports
    if (reportId !== selectedReportId) {
      selectStage(displayStages[0]?.id || '');
    }
  };

  // Save report when pipeline finishes running
  useEffect(() => {
    if (!isRunning && stages.some(s => s.status !== 'pending')) {
      const hasNewRun = stages.some(s => s.status === 'passed' || s.status === 'failed');
      if (hasNewRun && (reports.length === 0 || reports[0]?.stages !== stages)) {
        saveReport(stages, releaseStatus);
        // Clear selected report to show current run
        setSelectedReportId(null);
      }
    }
  }, [isRunning]);

  // Clear selected report when running a new pipeline
  useEffect(() => {
    if (isRunning) {
      setSelectedReportId(null);
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
              stages={displayStages}
              releaseStatus={displayReleaseStatus}
              selectedStageId={selectedStageId}
              onStageSelect={selectStage}
              isViewingHistory={!!selectedReportId}
              historyDate={selectedReport?.runDate}
            />
          </div>
          <div className="lg:col-span-2">
            <StageDetails stage={displaySelectedStage} />
          </div>
        </div>

        <OutputReport 
          stages={displayStages} 
          releaseStatus={displayReleaseStatus}
          reports={reports}
          isLoading={isLoadingReports}
          selectedReportId={selectedReportId}
          onSelectReport={handleSelectReport}
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
