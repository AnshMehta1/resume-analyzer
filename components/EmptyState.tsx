import { EmptyStateProps } from '@/lib/types'

export const EmptyState = ({title, message, buttonText, buttonHref}: EmptyStateProps) => {
    return (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-dashed">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="mt-2 text-gray-500">{message}</p>
            <a href={buttonHref} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {buttonText}
            </a>
        </div>
    );
}
