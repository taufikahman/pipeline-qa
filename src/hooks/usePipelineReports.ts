import { useState, useCallback, useEffect } from 'react';
import { Stage, PipelineReport } from '@/types/pipeline';
import { getPipelineHistory, savePipelineReportToApi, PipelineHistoryEntry } from '@/lib/api';

export function usePipelineReports() {
  const [reports, setReports] = useState<PipelineReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports from API on mount
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPipelineHistory();
      if (response.success && response.data) {
        // Transform API data to PipelineReport format
        const transformedReports: PipelineReport[] = response.data.map((entry: PipelineHistoryEntry) => ({
          id: entry.id.toString(),
          runDate: new Date(entry.executed_at),
          stages: entry.stages.map(s => ({
            id: s.id,
            name: s.name,
            type: s.type as Stage['type'],
            description: s.description || '',
            status: s.status as Stage['status'],
            logs: s.logs || [],
          })),
          releaseStatus: entry.status === 'SUCCESS' ? 'passed' : 
                        entry.status === 'BLOCKED' ? 'blocked' : 'pending',
          passRate: entry.pass_rate,
          // Include stats from report (used when stages are empty)
          totalPassed: entry.report?.total_passed ?? 0,
          totalFailed: entry.report?.total_failed ?? 0,
          totalPending: entry.report?.total_pending ?? 0,
        }));
        setReports(transformedReports);
      }
    } catch (err) {
      console.error('Error fetching pipeline history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const saveReport = useCallback(async (stages: Stage[], releaseStatus: 'pending' | 'passed' | 'blocked') => {
    const passedCount = stages.filter(s => s.status === 'passed').length;
    const totalCount = stages.length;
    const passRate = Math.round((passedCount / totalCount) * 100);

    // Create local report first for immediate UI update
    const newReport: PipelineReport = {
      id: crypto.randomUUID(),
      runDate: new Date(),
      stages: [...stages],
      releaseStatus,
      passRate,
    };

    setReports(prev => [newReport, ...prev]);

    // Save to API in background
    try {
      const apiStages = stages.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        status: s.status,
      }));
      
      const response = await savePipelineReportToApi(apiStages, releaseStatus);
      
      if (response.success) {
        // Update the local report with the API response ID
        setReports(prev => prev.map(r => 
          r.id === newReport.id 
            ? { ...r, id: response.data.history.id.toString() }
            : r
        ));
        console.log('Pipeline report saved to API:', response.data);
      }
    } catch (err) {
      console.error('Error saving report to API:', err);
      // Keep the local report even if API fails
    }

    return newReport;
  }, []);

  const getReportsByDate = useCallback((date: Date) => {
    return reports.filter(report => {
      const reportDate = new Date(report.runDate);
      return (
        reportDate.getFullYear() === date.getFullYear() &&
        reportDate.getMonth() === date.getMonth() &&
        reportDate.getDate() === date.getDate()
      );
    });
  }, [reports]);

  const exportReport = useCallback((report: PipelineReport, format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = JSON.stringify(report, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pipeline-report-${report.runDate.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Stage', 'Type', 'Status'];
      const rows = report.stages.map(s => [s.name, s.type, s.status]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pipeline-report-${report.runDate.toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  return {
    reports,
    isLoading,
    error,
    saveReport,
    getReportsByDate,
    exportReport,
    refetch: fetchReports,
  };
}
