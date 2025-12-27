import { useState, useCallback } from 'react';
import { Stage, PipelineReport } from '@/types/pipeline';

export function usePipelineReports() {
  const [reports, setReports] = useState<PipelineReport[]>([]);

  const saveReport = useCallback((stages: Stage[], releaseStatus: 'pending' | 'passed' | 'blocked') => {
    const passedCount = stages.filter(s => s.status === 'passed').length;
    const totalCount = stages.length;
    const passRate = Math.round((passedCount / totalCount) * 100);

    const newReport: PipelineReport = {
      id: crypto.randomUUID(),
      runDate: new Date(),
      stages: [...stages],
      releaseStatus,
      passRate,
    };

    setReports(prev => [newReport, ...prev]);
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
    saveReport,
    getReportsByDate,
    exportReport,
  };
}
