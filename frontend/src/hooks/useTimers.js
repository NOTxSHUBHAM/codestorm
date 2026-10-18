import { useEffect } from 'react';

export const useTimers = ({
  problemStartTimes,
  setProblemStartTimes,
  problemTimers,
  setProblemTimers,
  currentProblem,
  contestEnded
}) => {
  const startProblemTimer = (problemIndex) => {
    setProblemStartTimes(prev => ({
      ...prev,
      [problemIndex]: Date.now()
    }));
  };

  const stopProblemTimer = (problemIndex) => {
    setProblemStartTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[problemIndex];
      return newTimes;
    });
  };

  const updateProblemTimer = (problemIndex) => {
    const startTime = problemStartTimes[problemIndex];
    if (startTime) {
      const elapsed = Date.now() - startTime;
      setProblemTimers(prev => ({
        ...prev,
        [problemIndex]: (prev[problemIndex] || 0) + elapsed
      }));
      setProblemStartTimes(prev => ({
        ...prev,
        [problemIndex]: Date.now()
      }));
    }
  };

  useEffect(() => {
    if (contestEnded) return;

    const timer = setInterval(() => {
      updateProblemTimer(currentProblem);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentProblem, contestEnded, problemStartTimes]);

  return {
    startProblemTimer,
    stopProblemTimer,
    updateProblemTimer
  };
};
