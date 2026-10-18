import React from 'react';
import { FaCheck, FaStar } from 'react-icons/fa';

const ProblemSidebar = ({ 
  problems, 
  currentProblem, 
  solvedProblems, 
  switchToProblem, 
  formatProblemTime, 
  getCurrentProblemTime,
  isSE = false 
}) => {
  return (
    <div className="w-64 bg-card border-r border-border p-4">
      <h3 className="font-semibold mb-4">Problems</h3>
      <div className="space-y-2">
        {problems.map((problem, index) => (
          <button
            key={index}
            onClick={() => switchToProblem(index)}
            className={`w-full text-left p-3 rounded-lg flex flex-col gap-2 transition-colors ${
              currentProblem === index 
                ? 'bg-primary text-primary-foreground' 
                : solvedProblems.has(index)
                ? 'bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Problem {index + 1}</span>
                {isSE && problem.type === 'solving' && (
                  <FaStar className="h-3 w-3 text-yellow-500" title="Higher marks" />
                )}
              </div>
              {solvedProblems.has(index) && (
                <FaCheck className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-orange-100 text-orange-800 px-2 py-1 rounded-md border border-orange-200 shadow-sm">
                {formatProblemTime(getCurrentProblemTime(index))}
              </span>
              {isSE && (
                <span className={`text-xs px-2 py-1 rounded-md ${
                  problem.type === 'solving' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {problem.type === 'solving' ? 'Solving' : 'Debug'}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProblemSidebar;
