import React from 'react';

export const ScoreDisplay = ({ score }: { score: number }) => {
    const getScoreColorClass = () => {
        if (score > 70) {
            return 'text-green-600'; 
        }
        if (score <= 40) {
            return 'text-red-600';
        }
        return 'text-yellow-600';
    };

    const scoreColor = getScoreColorClass();

    return (
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-gray-500">Score:</span>
            <span className={`font-bold text-xl ${scoreColor}`}>{score}</span>
        </div>
    );
};
