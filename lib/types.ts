// --- Type Definitions for the Application ---

export type ResumeStatus = 'Approved' | 'Needs Revision' | 'Rejected' | 'Pending';

export interface StatusBadgeProps {
  status: ResumeStatus;
}

export interface Resume {
  id: string;
  file_path: string;
  status: ResumeStatus;
  score: number | null;
  notes: string | null;
  created_at: string; // ISO date string
  file_name: string;
}

export interface ResumeListProps {
  resumes: Resume[];
}

export interface EmptyStateProps {
  title: string;
  message: string;
  buttonText: string;
  buttonHref: string;
}

export interface UserProfile {
  email: string | null;
  username: string | null;
}

export interface UserProfileCardProps {
  profile: UserProfile | null;
  resumeCount: number | null;
  loading: boolean;
}

export interface ResumeWithProfile extends Resume {
  users: Pick<UserProfile, 'email' | 'username'> | null;
}

export interface ResumeTableProps {
  resumes: ResumeWithProfile[];
  onSelectResume: (resume: ResumeWithProfile) => void;
  selectedResumeId?: string;
}
