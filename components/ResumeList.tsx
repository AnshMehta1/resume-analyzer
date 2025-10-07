import { ResumeListProps } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { ScoreDisplay } from './ScoreDisplay';

export const ResumeList = ({ resumes }: ResumeListProps) => {
  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <div key={resume.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-grow">
              <p className="font-semibold text-lg text-gray-800 truncate">{resume.file_name}</p>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on: {new Date(resume.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-4">
              {resume.score !== null && (
                <ScoreDisplay score={resume.score} />
              )}
              <StatusBadge status={resume.status} />
            </div>
          </div>
          {resume.notes && (
            <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">Reviewer Feedback:</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{`"${resume.notes}"`}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
