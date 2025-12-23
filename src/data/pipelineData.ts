import { Stage, LogEntry } from '@/types/pipeline';

export const initialStages: Stage[] = [
  {
    id: 'pre-checks',
    name: 'Pre-checks',
    type: 'STATIC',
    description: 'Basic sanity checks: formatting, linting, config validation.',
    status: 'pending',
    logs: [
      { prefix: '[lint]', message: 'Running ESLint...', type: 'normal' },
      { prefix: '[lint]', message: '0 errors, 0 warnings', type: 'success' },
      { prefix: '[format]', message: 'Checking Prettier formatting...', type: 'normal' },
      { prefix: '[format]', message: 'All files formatted correctly', type: 'success' },
      { prefix: '[config]', message: 'Validating configuration...', type: 'normal' },
      { prefix: '[config]', message: 'Configuration valid', type: 'success' },
    ],
    artifacts: [],
  },
  {
    id: 'smoke-tests',
    name: 'Smoke Tests',
    type: 'MANUAL',
    description: 'Critical path verification (login, core navigation, create/read).',
    status: 'pending',
    logs: [
      { prefix: '[smoke]', message: 'Testing login flow...', type: 'normal' },
      { prefix: '[smoke]', message: 'Login successful', type: 'success' },
      { prefix: '[smoke]', message: 'Testing core navigation...', type: 'normal' },
      { prefix: '[smoke]', message: 'All routes accessible', type: 'success' },
      { prefix: '[smoke]', message: 'Testing CRUD operations...', type: 'normal' },
      { prefix: '[smoke]', message: 'Create/Read operations verified', type: 'success' },
    ],
    artifacts: [],
  },
  {
    id: 'api-tests',
    name: 'API Tests (Postman)',
    type: 'API',
    description: 'Positive + negative + auth coverage for key endpoints.',
    status: 'pending',
    logs: [
      { prefix: '[api]', message: 'newman run reqres-collection.json', type: 'normal' },
      { prefix: '[api]', message: 'target=reqres.in', type: 'normal' },
      { prefix: '[api]', message: '6 requests executed', type: 'normal' },
      { prefix: '[api]', message: '5 passed, 1 failed', type: 'warning' },
      { prefix: '[api]', message: 'FAIL: schema assertion mismatch on GET /users/2', type: 'error' },
      { prefix: '[api]', message: 'action: update contract & re-run', type: 'warning' },
    ],
    triageNote: 'The two failures stemmed from minor schema changes. Action: update schema assertion + align contract with dev, then re-run.',
    artifacts: [
      { name: 'Postman Collection', type: 'link' },
      { name: 'API Report (HTML)', type: 'report' },
    ],
  },
  {
    id: 'ui-e2e',
    name: 'UI E2E (Playwright)',
    type: 'UI',
    description: 'Regression E2E with POM + stable locators. Traces on failure.',
    status: 'pending',
    logs: [
      { prefix: '[e2e]', message: 'Running Playwright tests...', type: 'normal' },
      { prefix: '[e2e]', message: 'Browser: chromium', type: 'normal' },
      { prefix: '[e2e]', message: 'Tests: 24 total', type: 'normal' },
      { prefix: '[e2e]', message: '22 passed, 2 failed', type: 'warning' },
      { prefix: '[e2e]', message: 'FAIL: checkout.spec.ts - payment form timeout', type: 'error' },
      { prefix: '[e2e]', message: 'FAIL: profile.spec.ts - avatar upload assertion', type: 'error' },
      { prefix: '[e2e]', message: 'Traces saved to ./test-results/', type: 'normal' },
    ],
    triageNote: 'Payment form timeout likely due to slow third-party integration. Avatar upload needs updated selector after UI refactor.',
    artifacts: [
      { name: 'Playwright Report', type: 'report' },
      { name: 'Test Traces', type: 'link' },
    ],
  },
  {
    id: 'performance',
    name: 'Performance (k6)',
    type: 'PERF',
    description: 'Baseline scenario with thresholds (p95, error rate).',
    status: 'pending',
    logs: [
      { prefix: '[k6]', message: 'Running load test...', type: 'normal' },
      { prefix: '[k6]', message: 'VUs: 50, Duration: 5m', type: 'normal' },
      { prefix: '[k6]', message: 'Total requests: 15,234', type: 'normal' },
      { prefix: '[k6]', message: 'p95 response time: 245ms (threshold: 500ms)', type: 'success' },
      { prefix: '[k6]', message: 'Error rate: 0.02% (threshold: 1%)', type: 'success' },
      { prefix: '[k6]', message: 'All thresholds passed', type: 'success' },
    ],
    artifacts: [
      { name: 'K6 Summary', type: 'report' },
      { name: 'Grafana Dashboard', type: 'link' },
    ],
  },
  {
    id: 'quality-gate',
    name: 'Quality Gate',
    type: 'GATE',
    description: 'Release decision based on exit criteria.',
    status: 'pending',
    logs: [
      { prefix: '[gate]', message: 'Evaluating exit criteria...', type: 'normal' },
      { prefix: '[gate]', message: 'Pre-checks: PASSED', type: 'success' },
      { prefix: '[gate]', message: 'Smoke Tests: PASSED', type: 'success' },
      { prefix: '[gate]', message: 'API Tests: FAILED', type: 'error' },
      { prefix: '[gate]', message: 'UI E2E: FAILED', type: 'error' },
      { prefix: '[gate]', message: 'Performance: PASSED', type: 'success' },
      { prefix: '[gate]', message: 'Release decision: BLOCKED', type: 'error' },
    ],
    triageNote: 'Release blocked due to API and UI test failures. Fix required before deployment.',
    artifacts: [],
  },
];

export const getPassedLogs = (stageId: string): LogEntry[] => {
  const baseLogs: Record<string, LogEntry[]> = {
    'pre-checks': [
      { prefix: '[lint]', message: 'Running ESLint...', type: 'normal' },
      { prefix: '[lint]', message: '0 errors, 0 warnings', type: 'success' },
      { prefix: '[format]', message: 'All files formatted correctly', type: 'success' },
      { prefix: '[config]', message: 'Configuration valid', type: 'success' },
    ],
    'smoke-tests': [
      { prefix: '[smoke]', message: 'All critical paths verified', type: 'success' },
      { prefix: '[smoke]', message: 'Login: OK, Navigation: OK, CRUD: OK', type: 'success' },
    ],
    'api-tests': [
      { prefix: '[api]', message: 'newman run reqres-collection.json', type: 'normal' },
      { prefix: '[api]', message: '6 requests executed', type: 'normal' },
      { prefix: '[api]', message: '6 passed, 0 failed', type: 'success' },
      { prefix: '[api]', message: 'All assertions passed', type: 'success' },
    ],
    'ui-e2e': [
      { prefix: '[e2e]', message: 'Running Playwright tests...', type: 'normal' },
      { prefix: '[e2e]', message: '24 passed, 0 failed', type: 'success' },
      { prefix: '[e2e]', message: 'All E2E tests passed', type: 'success' },
    ],
    'performance': [
      { prefix: '[k6]', message: 'Load test completed', type: 'normal' },
      { prefix: '[k6]', message: 'All thresholds passed', type: 'success' },
    ],
    'quality-gate': [
      { prefix: '[gate]', message: 'All stages passed', type: 'success' },
      { prefix: '[gate]', message: 'Release decision: APPROVED', type: 'success' },
    ],
  };
  return baseLogs[stageId] || [];
};

export const getFailedLogs = (stageId: string): LogEntry[] => {
  const baseLogs: Record<string, LogEntry[]> = {
    'pre-checks': [
      { prefix: '[lint]', message: 'Running ESLint...', type: 'normal' },
      { prefix: '[lint]', message: '3 errors found', type: 'error' },
      { prefix: '[lint]', message: 'FAIL: unused variable in auth.ts', type: 'error' },
    ],
    'smoke-tests': [
      { prefix: '[smoke]', message: 'Testing login flow...', type: 'normal' },
      { prefix: '[smoke]', message: 'FAIL: Login button unresponsive', type: 'error' },
    ],
    'api-tests': initialStages.find(s => s.id === 'api-tests')?.logs || [],
    'ui-e2e': initialStages.find(s => s.id === 'ui-e2e')?.logs || [],
    'performance': [
      { prefix: '[k6]', message: 'Load test completed', type: 'normal' },
      { prefix: '[k6]', message: 'p95: 850ms (threshold: 500ms)', type: 'error' },
      { prefix: '[k6]', message: 'FAIL: Response time threshold exceeded', type: 'error' },
    ],
    'quality-gate': [
      { prefix: '[gate]', message: 'Evaluating exit criteria...', type: 'normal' },
      { prefix: '[gate]', message: 'One or more stages failed', type: 'error' },
      { prefix: '[gate]', message: 'Release decision: BLOCKED', type: 'error' },
    ],
  };
  return baseLogs[stageId] || [];
};
