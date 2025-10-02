// --- Type Definitions for the Application ---

// Defines the possible states a resume submission can be in
export type ResumeStatus = 'Approved' | 'Needs Revision' | 'Rejected' | 'Pending';

// Represents the structure of a single resume submission record
export interface Resume {
  id: string;
  file_path: string;
  status: ResumeStatus;
  score: number | null;
  notes: string | null;
  created_at: string; // ISO date string
  file_name: string;
}
