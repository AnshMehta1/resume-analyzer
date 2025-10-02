import { ResumeListProps } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

export const ResumeList = ({ resumes }: ResumeListProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {resumes.map((resume) => (
          <li key={resume.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <p className="font-semibold text-lg text-gray-800 truncate">{resume.file_name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted on: {new Date(resume.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={resume.status} />
              </div>
            </div>
            {resume.notes && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">Reviewer Feedback:</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono">"{resume.notes}"</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
