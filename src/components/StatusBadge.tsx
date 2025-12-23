import { StageStatus } from '@/types/pipeline';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StageStatus;
  className?: string;
}

const statusLabels: Record<StageStatus, string> = {
  passed: 'PASSED',
  failed: 'FAILED',
  blocked: 'BLOCKED',
  running: 'RUNNING',
  pending: 'PENDING',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'status-badge',
        {
          'status-passed': status === 'passed',
          'status-failed': status === 'failed',
          'status-blocked': status === 'blocked',
          'status-running': status === 'running',
          'status-pending': status === 'pending',
        },
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
