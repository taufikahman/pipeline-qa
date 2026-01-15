import { useState } from 'react';
import { Stage, PipelineReport } from '@/types/pipeline';
import { CheckCircle2, XCircle, Clock, FileText, AlertTriangle, TrendingUp, Calendar, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OutputReportProps {
  stages: Stage[];
  releaseStatus: 'pending' | 'passed' | 'blocked';
  reports?: PipelineReport[];
  isLoading?: boolean;
  selectedReportId?: string | null;
  onSelectReport?: (reportId: string | null) => void;
}

export function OutputReport({ 
  stages, 
  releaseStatus, 
  reports = [], 
  isLoading = false,
  selectedReportId = null,
  onSelectReport,
}: OutputReportProps) {
  const selectedReport = selectedReportId ? reports.find(r => r.id === selectedReportId) : null;
  const isViewingHistory = !!selectedReport;
  
  const hasRun = stages.some(s => s.status !== 'pending');
  // Show report section if pipeline has run OR viewing historical report
  const shouldShowReport = hasRun || isViewingHistory;

  const displayStages = selectedReport ? selectedReport.stages : stages;
  const displayStatus = selectedReport ? selectedReport.releaseStatus : releaseStatus;

  // Calculate counts - use report data if viewing history (especially when stages are empty)
  const passedCount = selectedReport 
    ? (displayStages.length > 0 
        ? displayStages.filter(s => s.status === 'passed').length 
        : selectedReport.totalPassed ?? 0)
    : stages.filter(s => s.status === 'passed').length;
  const failedCount = selectedReport 
    ? (displayStages.length > 0 
        ? displayStages.filter(s => s.status === 'failed').length 
        : selectedReport.totalFailed ?? 0)
    : stages.filter(s => s.status === 'failed').length;
  const pendingCount = selectedReport 
    ? (displayStages.length > 0 
        ? displayStages.filter(s => s.status === 'pending').length 
        : selectedReport.totalPending ?? 0)
    : stages.filter(s => s.status === 'pending').length;
  const totalCount = displayStages.length || (passedCount + failedCount + pendingCount) || 1;
  
  // Use report's passRate if viewing history, otherwise calculate
  const passRate = selectedReport 
    ? selectedReport.passRate 
    : Math.round((passedCount / totalCount) * 100);

  const getStatusIcon = (status: Stage['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="text-success" size={16} />;
      case 'failed':
        return <XCircle className="text-destructive" size={16} />;
      default:
        return <Clock className="text-muted-foreground" size={16} />;
    }
  };

  // Group reports by date
  const reportsByDate = reports.reduce((acc, report) => {
    const dateKey = format(new Date(report.runDate), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(report);
    return acc;
  }, {} as Record<string, PipelineReport[]>);

  return (
    <>
      {/* Pipeline Report Section - Show if pipeline has run OR viewing historical report */}
      {shouldShowReport && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Pipeline Report</h2>
              <p className="text-sm text-muted-foreground">
                {selectedReport 
                  ? `Report from ${format(new Date(selectedReport.runDate), 'PPpp')}`
                  : 'Execution summary and results'}
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-success/10 border border-success/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="text-success" size={16} />
                <span className="text-xs font-medium text-success uppercase tracking-wider">Passed</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {passedCount}
              </p>
            </div>
            
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="text-destructive" size={16} />
                <span className="text-xs font-medium text-destructive uppercase tracking-wider">Failed</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {failedCount}
              </p>
            </div>
            
            <div className="bg-muted border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="text-muted-foreground" size={16} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {pendingCount}
              </p>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="text-primary" size={16} />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Pass Rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {passRate}%
              </p>
            </div>
          </div>

          {/* Release Status */}
          <div className={cn(
            "rounded-xl p-4 mb-6 border",
            displayStatus === 'passed' 
              ? "bg-success/10 border-success/20" 
              : "bg-destructive/10 border-destructive/20"
          )}>
            <div className="flex items-center gap-3">
              {displayStatus === 'passed' ? (
                <CheckCircle2 className="text-success" size={24} />
              ) : (
                <AlertTriangle className="text-destructive" size={24} />
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {displayStatus === 'passed' ? 'Release Ready' : 'Release Blocked'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {displayStatus === 'passed' 
                    ? 'All quality gates passed. Safe to deploy.' 
                    : 'Quality gate failed. Review and fix issues before release.'}
                </p>
              </div>
            </div>
          </div>

          {/* Stage Results Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm">Stage Results</h3>
            </div>
            {displayStages.length > 0 ? (
              <div className="divide-y divide-border">
                {displayStages.map((stage) => (
                  <div key={stage.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(stage.status)}
                      <div>
                        <p className="font-medium text-foreground text-sm">{stage.name}</p>
                        <p className="text-xs text-muted-foreground">{stage.type}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      stage.status === 'passed' && "bg-success/10 text-success",
                      stage.status === 'failed' && "bg-destructive/10 text-destructive",
                      stage.status === 'pending' && "bg-muted text-muted-foreground"
                    )}>
                      {stage.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Clock className="mx-auto text-muted-foreground/50 mb-2" size={24} />
                <p className="text-sm text-muted-foreground">
                  Detail stages tidak tersedia untuk report ini
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report History Section - ALWAYS VISIBLE */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Report History</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading 
                ? 'Loading history...' 
                : reports.length > 0 
                  ? `${reports.length} pipeline run${reports.length !== 1 ? 's' : ''} recorded`
                  : 'No pipeline runs recorded yet'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="border border-border rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-muted-foreground">Loading report history...</p>
            </div>
          </div>
        ) : reports.length > 0 ? (
          <div className="border border-border rounded-xl overflow-hidden">
            {Object.entries(reportsByDate).map(([date, dateReports]) => (
              <div key={date}>
                <div className="bg-muted/50 px-4 py-2 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">
                    {format(new Date(date), 'PPP')}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {dateReports.map((report) => (
                    <div
                      key={report.id}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors",
                        selectedReportId === report.id && "bg-primary/5"
                      )}
                      onClick={() => onSelectReport?.(selectedReportId === report.id ? null : report.id)}
                    >
                      <div className="flex items-center gap-3">
                        {report.releaseStatus === 'passed' ? (
                          <CheckCircle2 className="text-success" size={16} />
                        ) : (
                          <XCircle className="text-destructive" size={16} />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {format(new Date(report.runDate), 'p')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pass rate: {report.passRate}%
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        report.releaseStatus === 'passed' && "bg-success/10 text-success",
                        report.releaseStatus === 'blocked' && "bg-destructive/10 text-destructive"
                      )}>
                        {report.releaseStatus.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <History className="text-muted-foreground" size={24} />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No reports yet</p>
              <p className="text-xs text-muted-foreground">
                Run a pipeline to see the history here
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
