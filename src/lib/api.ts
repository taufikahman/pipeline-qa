const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface RunPipelineResponse {
  success: boolean;
  data: {
    pipelineHistory: {
      id: number;
      pipeline_report_id: number;
      status: string;
      pass_rate: number;
      executed_at: string;
    };
    testResults: {
      passed: number;
      failed: number;
      total: number;
      pass_rate: number;
      status: string;
    };
    report: {
      id: number;
      release_status: string;
      created_at: string;
    };
  };
  message?: string;
  error?: string;
}

export interface PipelineHistoryEntry {
  id: number;
  pipeline_report_id: number | null;
  executed_at: string;
  pass_rate: number;
  status: string;
  created_at: string;
  report: {
    id: number;
    total_passed: number;
    total_failed: number;
    total_pending: number;
    pass_rate: number;
    release_status: string;
    created_at: string;
  } | null;
  stages: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    description?: string;
    logs?: any[];
  }>;
}

export interface PipelineHistory {
  id: number;
  pipeline_report_id: number;
  executed_at: string;
  pass_rate: number;
  status: string;
  created_at: string;
}

export interface PipelineReport {
  id: number;
  total_passed: number;
  total_failed: number;
  total_pending: number;
  pass_rate: number;
  release_status: string;
  created_at: string;
  executed_at?: string;
  stages?: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    description?: string;
    logs?: any[];
  }>;
}

/**
 * Run pipeline with Playwright smoke tests
 */
export async function runPipeline(stages?: any[]): Promise<RunPipelineResponse> {
  const response = await fetch(`${API_BASE_URL}/pipelines/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stages }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to run pipeline');
  }

  return response.json();
}

/**
 * Get pipeline history with associated reports and stages
 */
export async function getPipelineHistory(): Promise<{ success: boolean; data: PipelineHistoryEntry[] }> {
  const response = await fetch(`${API_BASE_URL}/pipelines/history`);

  if (!response.ok) {
    throw new Error('Failed to fetch pipeline history');
  }

  return response.json();
}

/**
 * Get pipeline reports with stages
 */
export async function getPipelineReports(): Promise<{ success: boolean; data: any[] }> {
  try {
    console.log('Fetching from:', `${API_BASE_URL}/pipelines/reports`);
    const response = await fetch(`${API_BASE_URL}/pipelines/reports`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch pipeline reports: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    
    // Transform data to match frontend format
    if (result.success && result.data) {
      result.data = result.data.map((report: any) => ({
        id: report.id.toString(),
        runDate: new Date(report.executed_at || report.created_at),
        stages: report.stages || [],
        releaseStatus: report.release_status === 'RELEASED' || report.release_status === 'passed' ? 'passed' : 
                       report.release_status === 'BLOCKED' || report.release_status === 'blocked' ? 'blocked' : 'pending',
        passRate: parseFloat(report.pass_rate) || 0,
        total_passed: report.total_passed || 0,
        total_failed: report.total_failed || 0,
        total_pending: report.total_pending || 0,
        executed_at: report.executed_at,
        created_at: report.created_at,
      }));
      console.log('Transformed data:', result.data);
    } else {
      console.warn('No data in response or not successful:', result);
      result.data = [];
    }

    return result;
  } catch (error) {
    console.error('Error in getPipelineReports:', error);
    throw error;
  }
}

/**
 * Get pipeline by ID
 */
export async function getPipelineById(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/pipelines/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch pipeline');
  }

  return response.json();
}

/**
 * Save pipeline report and create history entry
 */
export async function savePipelineReportToApi(
  stages: Array<{ id: string; name: string; type: string; status: string }>,
  releaseStatus: 'pending' | 'passed' | 'blocked'
): Promise<{
  success: boolean;
  data: {
    history: {
      id: number;
      pipeline_report_id: number;
      executed_at: string;
      pass_rate: number;
      status: string;
    };
    report: {
      id: number;
      total_passed: number;
      total_failed: number;
      total_pending: number;
      pass_rate: number;
      release_status: string;
      created_at: string;
    };
    stagesCount: number;
  };
}> {
  const response = await fetch(`${API_BASE_URL}/pipelines/save-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stages, releaseStatus }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save pipeline report');
  }

  return response.json();
}
