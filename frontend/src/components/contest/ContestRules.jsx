import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaClock,
  FaCode,
  FaTrophy,
  FaExclamationTriangle,
  FaHeadset,
  FaGavel,
  FaStar,
  FaLanguage
} from 'react-icons/fa';
import { Button } from '../ui/button';
import ThemeToggle from './ThemeToggle';

const LANG_COLORS = [
  "var(--chart-1)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-2)",
  "var(--chart-3)"
];

const ContestRules = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] py-8 px-4 md:px-6 lg:px-8 relative">
      {/* Theme toggle button in top-right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center tracking-tight">
          Escape Room — Round 1
        </h1>
        <p className="text-lg md:text-xl text-center mt-2 font-medium">
          Presented by CodeStorm
        </p>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 lg:items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-4 md:gap-6 h-full">
          {/* Overview */}
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow p-4 md:p-5 flex flex-col gap-2">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-[color:var(--primary)]">
              <FaCode className="h-5 w-5" />
              Overview
            </h3>
            <ul className="space-y-2 text-[color:var(--foreground)] text-sm md:text-base">
              <li className="flex items-baseline gap-3">
                <span>•</span>
                <span>Total of <b>5 Coding Problems</b></span>
              </li>
              <li className="flex items-baseline gap-3">
                <span>•</span>
                <span>
                  For <b>Second Year (SE)</b> participants:
                  <div className="ml-4 mt-2 space-y-1 bg-[color:var(--muted)]/60 p-2 rounded border border-[color:var(--border)]">
                    <div className="flex items-center gap-2">
                      <FaStar className="h-3 w-3" />
                      <span><b>Solving</b> – higher marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStar className="h-3 w-3" />
                      <span><b>Debugging</b> – lower marks</span>
                    </div>
                  </div>
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span>•</span>
                <span>For <b>other participants</b>: All 5 problems are solving-type with equal weightage</span>
              </li>
            </ul>
          </div>

          {/* Duration */}
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow p-4 md:p-5 flex flex-col gap-2">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-[color:var(--primary)]">
              <FaClock className="h-5 w-5" />
              Duration
            </h3>
            <ul className="space-y-2 text-[color:var(--foreground)] text-sm md:text-base">
              <li className="flex items-baseline gap-3">
                <span>•</span>
                <span><b>45 Minutes Total</b></span>
              </li>
              <li className="flex items-baseline gap-3">
                <FaExclamationTriangle className="h-4 w-4" />
                <span>The timer is <b>strict</b> and <b>cannot be paused</b></span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow p-4 md:p-5 flex flex-col gap-2 flex-grow">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-[color:var(--primary)]">
              <FaTrophy className="h-5 w-5" />
              Ranking Criteria
            </h3>
            <ul className="space-y-2 text-[color:var(--foreground)] text-sm md:text-base">
              <li className="flex items-baseline gap-3">
                <span>1.</span>
                <span>&nbsp;Number of problems solved (Priority 1)</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span>2.</span>
                <span>Total time taken (Priority 2)</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span>3.</span>
                <span>
                  Tie breaker: <b>Total time taken for only solved questions</b> (Priority 3)
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span>4.</span>
                <span>
                  Total of 6 teams will move forward to Round 2
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span>5.</span>
                <span>
                  Top 2 from the SE and Top 4 from TE/BE (no preference) will be selected
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span>6.</span>
                <span>
                 Hardcoding of test cases will NOT be accepted as a valid solution
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 md:gap-6 h-full">
          {/* Languages */}
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow p-4 md:p-5 flex flex-col gap-2 flex-grow">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-[color:var(--primary)]">
              <FaLanguage className="h-5 w-5" />
              Allowed Languages
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {['C', 'C++', 'Java', 'Python', 'JavaScript'].map((lang, i) => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded font-semibold text-sm md:text-base border border-[color:var(--border)]"
                  style={{
                    background: "var(--muted)",
                    color: "var(--foreground)",
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Monitoring */}
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow p-4 md:p-5 flex flex-col gap-2 flex-grow">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-[color:var(--primary)]">
              <FaExclamationTriangle className="h-5 w-5" />
              Monitoring & Fair Play
            </h3>
            <div className="space-y-2 text-[color:var(--foreground)] text-sm md:text-base">
              <div className="bg-[color:var(--muted)]/60 p-4 rounded border border-[color:var(--border)]">
                <div className="font-bold mb-1.5">No Tab Switching:</div>
                <ul className="ml-4 space-y-1">
                  <li className="flex items-baseline gap-3">
                    <span>⚠️</span>
                    <span>First switch → <b>Warning</b></span>
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span>❌</span>
                    <span>Second switch → <b>Immediate Disqualification</b></span>
                  </li>
                </ul>
              </div>
              <div className="mt-3 bg-[color:var(--muted)]/60 p-4 rounded border border-[color:var(--border)]">
                <div className="font-bold mb-1.5">Academic Integrity:</div>
                <ul className="ml-4 space-y-1">
                  <li className="flex items-baseline gap-3">
                    <span>•</span>
                    <span>
                      <b>Cheating</b>, <b>plagiarism</b>, or <b>unauthorized collaboration</b> is strictly prohibited
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow p-4 md:p-5 flex flex-col gap-2">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-[color:var(--primary)]">
              <FaHeadset className="h-5 w-5" />
              Technical Support
            </h3>
            <p className="text-[color:var(--foreground)] text-sm md:text-base">
              For any <b>technical issues</b>, contact the organizing team <b>immediately</b>.
            </p>
          </div>

          {/* Final Decisions */}
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow p-4 md:p-5 flex flex-col gap-2">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-[color:var(--primary)]">
              <FaGavel className="h-5 w-5" />
              Final Decisions
            </h3>
            <p className="text-[color:var(--foreground)] text-sm md:text-base">
              All decisions made by the <b>organizing team</b> are <b>final and binding</b>.
            </p>
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="w-full max-w-6xl mx-auto flex justify-center mt-8">
        <Button
          onClick={() => navigate('/round-1/branch-selection')}
          size="lg"
          className="text-lg px-8 py-6 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default ContestRules;
