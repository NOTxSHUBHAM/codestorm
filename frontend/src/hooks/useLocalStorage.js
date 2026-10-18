export const useLocalStorage = (selectedBranch, getCurrentProblemTime, problemStartTimes) => {
  const saveCodeToLocalStorage = (currentProblem, code, language) => {
    if (!selectedBranch || !code) return;
    
    const key = `contest_${selectedBranch}_problem_${currentProblem}`;
    const data = {
      code: code,
      language: language,
      timestamp: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(data));
    
    // **UPDATED: Get the ACTUAL current time including running timer**
    const currentTimer = getCurrentProblemTime(currentProblem);
    const timerKey = `contest_${selectedBranch}_timer_${currentProblem}`;
    const startTimeKey = `contest_${selectedBranch}_starttime_${currentProblem}`;
    
    // Save the total elapsed time
    localStorage.setItem(timerKey, currentTimer.toString());
    
    // Save when the current session started (for calculating on refresh)
    if (problemStartTimes[currentProblem]) {
      localStorage.setItem(startTimeKey, problemStartTimes[currentProblem].toString());
    }
    
    console.log(`Saved code and timer (${currentTimer}ms) to localStorage for problem ${currentProblem}`);
  };

  const loadCodeFromLocalStorage = (problemIndex) => {
    const key = `contest_${selectedBranch}_problem_${problemIndex}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
      try {
        const { code: savedCode, language: savedLanguage } = JSON.parse(saved);
        return { code: savedCode, language: savedLanguage };
      } catch (error) {
        console.error('Error parsing saved code:', error);
      }
    }
    
    return null;
  };

  const loadTimersFromLocalStorage = (problems, setProblemTimers, setProblemStartTimes, currentProblem) => {
    if (!selectedBranch) return;
    
    for (let i = 0; i < problems.length; i++) {
      const timerKey = `contest_${selectedBranch}_timer_${i}`;
      const startTimeKey = `contest_${selectedBranch}_starttime_${i}`;
      
      const savedTimer = localStorage.getItem(timerKey);
      const savedStartTime = localStorage.getItem(startTimeKey);
      
      if (savedTimer) {
        setProblemTimers(prev => ({
          ...prev,
          [i]: parseInt(savedTimer)
        }));
      }
      
      // **UPDATED: Only restore start time for current problem, and adjust for time elapsed**
      if (savedStartTime && i === currentProblem) {
        // The saved start time is when we last saved, so we need to reset it to now
        setProblemStartTimes(prev => ({
          ...prev,
          [i]: Date.now() // Start fresh from now, using the saved base time
        }));
        console.log(`Restored and reset timer start time for current problem ${i}`);
      }
    }
  };

  // **NEW: Save current problem to localStorage**
  const saveCurrentProblem = (problemIndex) => {
    if (!selectedBranch) return;
    const key = `contest_${selectedBranch}_currentProblem`;
    localStorage.setItem(key, problemIndex.toString());
  };

  // **NEW: Load current problem from localStorage**
  const loadCurrentProblem = () => {
    if (!selectedBranch) return 0;
    const key = `contest_${selectedBranch}_currentProblem`;
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved) : 0;
  };

  return {
    saveCodeToLocalStorage,
    loadCodeFromLocalStorage,
    loadTimersFromLocalStorage,
    saveCurrentProblem,
    loadCurrentProblem
  };
};
