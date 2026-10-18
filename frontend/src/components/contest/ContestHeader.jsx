import React from 'react';
import { FaClock } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const ContestHeader = ({ selectedBranch, solvedCount, totalProblems, timeLeft, formatTime, onEndContest }) => {
  return (
    <div className="bg-card border-b border-border p-4 shadow-sm">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold">Round 1 - {selectedBranch}</h1>
            <p className="text-sm text-muted-foreground">
              Solved: {solvedCount}/{totalProblems}
            </p>
          </div>
          <div className="flex items-center gap-2 text-lg font-mono">
            <FaClock className="h-5 w-5 text-primary" />
            <span className={timeLeft < 5 * 60 * 1000 ? 'text-destructive' : 'text-primary'}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={onEndContest}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
          >
            End Contest
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestHeader;
