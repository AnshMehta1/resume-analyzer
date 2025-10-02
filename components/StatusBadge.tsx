import { ResumeStatus, StatusBadgeProps } from '@/lib/types';

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const baseClasses = "px-3 py-1 text-xs font-bold leading-none rounded-full";
  
  const statusConfig: Record<ResumeStatus, { classes: string; label: string }> = {
    'Approved': { classes: 'bg-green-100 text-green-800', label: 'Approved' },
    'Needs Revision': { classes: 'bg-yellow-100 text-yellow-800', label: 'Needs Revision' },
    'Rejected': { classes: 'bg-red-100 text-red-800', label: 'Rejected' },
    'Pending': { classes: 'bg-gray-200 text-gray-800 animate-pulse', label: 'Pending Review' },
  };

  const config = statusConfig[status];

  return <span className={`${baseClasses} ${config.classes}`}>{config.label}</span>;
};
