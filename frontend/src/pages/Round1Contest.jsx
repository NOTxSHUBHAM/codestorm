import React, { useEffect, useRef } from 'react';
import { useTabSwitch } from '../lib/useTabSwitch';
import { useRateLimit } from '../lib/rateLimit';
import { useContest } from '../hooks/useContest';
import { useTimers } from '../hooks/useTimers';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCodeSubmission } from '../hooks/useCodeSubmission';
import { FaGripVertical, FaClock } from 'react-icons/fa';
import { toast } from 'sonner';
import ContestHeader from '../components/contest/ContestHeader';
import ProblemSidebar from '../components/contest/ProblemSidebar';
import ProblemStatement from '../components/contest/ProblemStatement';
import CodeEditor from '../components/contest/CodeEditor';
import OutputPanel from '../components/contest/OutputPanel';

const Contest = () => {
  const contestState = useContest();
  const {
    selectedBranch,
    setSelectedBranch,
    problems,
    currentProblem,
    setCurrentProblem,
    code,
    setCode,
    language,
    setLanguage,
    solvedProblems,
    contestEnded,
    timeLeft,
    setTimeLeft,
    startTime,
    setStartTime,
    submissions,
    problemTimers,
    setProblemTimers,
    problemStartTimes,
    setProblemStartTimes,
    tabSwitchWarningIssued,
    setTabSwitchWarningIssued,
    tabSwitchCountRef,
    lastHideTimestampRef,
    isSE,
    formatTime,
    formatProblemTime,
    getCurrentProblemTime,
    loadProblems,
    initializeResults,
    endContest,
    getBoilerplateCode,
    navigate,
    CONTEST_DURATION
  } = contestState;

  const timerHooks = useTimers({
    problemStartTimes,
    setProblemStartTimes,
    problemTimers,
    setProblemTimers,
    currentProblem,
    contestEnded
  });

  const { startProblemTimer, stopProblemTimer, updateProblemTimer } = timerHooks;

  const storageHooks = useLocalStorage(selectedBranch, getCurrentProblemTime, problemStartTimes);
  const { 
    saveCodeToLocalStorage, 
    loadCodeFromLocalStorage, 
    loadTimersFromLocalStorage,
    saveCurrentProblem,
    loadCurrentProblem
  } = storageHooks;

  const submissionHooks = useCodeSubmission({
    ...contestState,
    problemTimers
  });

  const { isSubmitting, output, submitSolution, setOutput } = submissionHooks;
  const { canExecute, recordAttempt } = useRateLimit(5, 60000);

  // Resizer states
  const [leftWidth, setLeftWidth] = React.useState(40);
  const [topHeight, setTopHeight] = React.useState(70);
  const containerRef = useRef(null);
  const isResizingHorizontal = useRef(false);
  const isResizingVertical = useRef(false);
  const hasLoadedInitialCode = useRef(false);
  const isInitialLoad = useRef(true); // **NEW: Track initial load**

  // Tab switch detection
  useTabSwitch(() => {
    if (contestEnded) return;
    if (!document.hidden) return;

    const now = Date.now();
    if (now - lastHideTimestampRef.current < 300) return;
    lastHideTimestampRef.current = now;

    tabSwitchCountRef.current += 1;

    if (tabSwitchCountRef.current === 1) {
      if (!tabSwitchWarningIssued) {
        setTabSwitchWarningIssued(true);
        toast.warning('Tab switch detected. Warning: Next switch will end the contest.');
      }
      return;
    }

    if (tabSwitchCountRef.current >= 2) {
      toast.error('Second tab switch detected. Contest ended.');
      endContest();
    }
  });

  // Resize handlers
  const handleMouseDownHorizontal = (e) => {
    e.preventDefault();
    isResizingHorizontal.current = true;
    document.addEventListener('mousemove', handleMouseMoveHorizontal);
    document.addEventListener('mouseup', handleMouseUpHorizontal);
  };

  const handleMouseMoveHorizontal = (e) => {
    if (!isResizingHorizontal.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 70) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUpHorizontal = () => {
    isResizingHorizontal.current = false;
    document.removeEventListener('mousemove', handleMouseMoveHorizontal);
    document.removeEventListener('mouseup', handleMouseUpHorizontal);
  };

  const handleMouseDownVertical = (e) => {
    e.preventDefault();
    isResizingVertical.current = true;
    document.addEventListener('mousemove', handleMouseMoveVertical);
    document.addEventListener('mouseup', handleMouseUpVertical);
  };

  const handleMouseMoveVertical = (e) => {
    if (!isResizingVertical.current || !containerRef.current) return;
    const rightPanel = containerRef.current.querySelector('.right-panel');
    if (!rightPanel) return;
    const rect = rightPanel.getBoundingClientRect();
    const newTopHeight = ((e.clientY - rect.top) / rect.height) * 100;
    if (newTopHeight > 40 && newTopHeight < 85) {
      setTopHeight(newTopHeight);
    }
  };

  const handleMouseUpVertical = () => {
    isResizingVertical.current = false;
    document.removeEventListener('mousemove', handleMouseMoveVertical);
    document.removeEventListener('mouseup', handleMouseUpVertical);
  };

  const switchToProblem = (problemIndex) => {
    if (problemIndex === currentProblem) return;
    
    saveCodeToLocalStorage(currentProblem, code, language);
    updateProblemTimer(currentProblem);
    stopProblemTimer(currentProblem);
    
    setCurrentProblem(problemIndex);
    saveCurrentProblem(problemIndex);
    startProblemTimer(problemIndex);
    
    setTimeout(() => {
      // Priority 1: localStorage
      const savedCode = loadCodeFromLocalStorage(problemIndex);
      if (savedCode && savedCode.code.trim()) {
        setCode(savedCode.code);
        setLanguage(savedCode.language);
        console.log(`✅ Loaded localStorage code for problem ${problemIndex}`);
        return;
      }
      
      // Priority 2: Firebase (solved)
      if (submissions[problemIndex] && submissions[problemIndex].solvedAt) {
        setCode(submissions[problemIndex].code || '');
        setLanguage(submissions[problemIndex].language || 'cpp');
        console.log(`✅ Loaded solved code from Firebase for problem ${problemIndex}`);
        return;
      }
      
      // Priority 3: Boilerplate
      if (problems[problemIndex]) {
        setCode(getBoilerplateCode(problemIndex, language));
        console.log(`✅ Loaded boilerplate for problem ${problemIndex}`);
      }
    }, 50);
  };

  // **UPDATED: Auto-save with immediate timer persistence**
  useEffect(() => {
    if (!code || !selectedBranch || solvedProblems.has(currentProblem)) return;
    
    const timeoutId = setTimeout(() => {
      saveCodeToLocalStorage(currentProblem, code, language);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [code, language, selectedBranch, currentProblem]);

  // **UPDATED: Code restoration - only when currentProblem changes**
  useEffect(() => {
    if (problems.length > 0 && selectedBranch && !isInitialLoad.current) {
      // Priority 1: localStorage
      const savedCode = loadCodeFromLocalStorage(currentProblem);
      if (savedCode && savedCode.code.trim()) {
        setCode(savedCode.code);
        setLanguage(savedCode.language);
        console.log(`✅ Restored localStorage code for problem ${currentProblem}`);
        return;
      }
      
      // Priority 2: Firebase (solved)
      if (submissions[currentProblem] && submissions[currentProblem].solvedAt) {
        const solvedCode = submissions[currentProblem].code || '';
        setCode(solvedCode);
        setLanguage(submissions[currentProblem].language || 'cpp');
        console.log(`✅ Restored solved code from Firebase for problem ${currentProblem}`);
        return;
      }
      
      // Priority 3: Boilerplate
      const boilerplate = getBoilerplateCode(currentProblem, language);
      if (boilerplate) {
        setCode(boilerplate);
        console.log(`✅ Loaded boilerplate for problem ${currentProblem}`);
      }
    }
  }, [currentProblem, problems, selectedBranch]); // Only when currentProblem changes

  // **UPDATED: Main timer with periodic saves**
  useEffect(() => {
    if (!startTime || contestEnded) return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, CONTEST_DURATION - elapsed);
      setTimeLeft(remaining);

      if (elapsed % 5000 < 1000) {
        saveCodeToLocalStorage(currentProblem, code, language);
      }

      if (remaining <= 0) {
        endContest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, contestEnded, currentProblem, code, language]);

  // **UPDATED: Initialize with current problem restoration**
  useEffect(() => {
    const branch = localStorage.getItem('selectedBranch');
    if (!branch) {
      navigate('/round-1/branch-selection');
      return;
    }
    
    setSelectedBranch(branch);
    
    initializeResults(branch).then(() => {
      if (!startTime && !localStorage.getItem(`contest_started_${branch}`)) {
        const newStartTime = Date.now();
        setStartTime(newStartTime);
        localStorage.setItem(`contest_started_${branch}`, newStartTime.toString());
      } else if (!startTime) {
        const savedStartTime = localStorage.getItem(`contest_started_${branch}`);
        if (savedStartTime) {
          setStartTime(parseInt(savedStartTime));
        }
      }
    });
  }, [navigate]);

  // **FIXED: Load timers, code, and restore current problem properly**
  useEffect(() => {
    if (selectedBranch && problems.length > 0 && isInitialLoad.current) {
      isInitialLoad.current = false; // Mark that initial load is done
      
      // Step 1: Restore current problem from localStorage
      const savedProblem = loadCurrentProblem();
      if (savedProblem !== 0 && savedProblem < problems.length) {
        setCurrentProblem(savedProblem);
        console.log(`✅ Restored current problem: ${savedProblem}`);
      }
      
      // Step 2: Load timers from localStorage
      loadTimersFromLocalStorage(problems, setProblemTimers, setProblemStartTimes, savedProblem || 0);
      
      // Step 3: Start timer for the restored problem
      startProblemTimer(savedProblem || 0);
      
      // Step 4: Load code AFTER currentProblem is set
      setTimeout(() => {
        const problemToLoad = savedProblem || 0;
        
        // Priority 1: localStorage
        const savedCode = loadCodeFromLocalStorage(problemToLoad);
        if (savedCode && savedCode.code.trim()) {
          setCode(savedCode.code);
          setLanguage(savedCode.language);
          hasLoadedInitialCode.current = true;
          console.log(`✅ Loaded localStorage code on init for problem ${problemToLoad}`);
          return;
        }
        
        // Priority 2: Firebase (solved)
        if (submissions[problemToLoad] && submissions[problemToLoad].solvedAt) {
          setCode(submissions[problemToLoad].code || '');
          setLanguage(submissions[problemToLoad].language || 'cpp');
          hasLoadedInitialCode.current = true;
          console.log(`✅ Loaded solved code on init for problem ${problemToLoad}`);
          return;
        }
        
        // Priority 3: Boilerplate - **FIXED: Use problemToLoad, not currentProblem**
        const boilerplate = getBoilerplateCode(problemToLoad, language);
        if (boilerplate) {
          setCode(boilerplate);
          hasLoadedInitialCode.current = true;
          console.log(`✅ Loaded boilerplate on init for problem ${problemToLoad}`);
        }
      }, 300); // Increased timeout to ensure state updates
    }
  }, [selectedBranch, problems]);

  // **NEW: Handle language change - load appropriate boilerplate/saved code**
  useEffect(() => {
    if (problems.length === 0 || !selectedBranch || solvedProblems.has(currentProblem)) return;
    
    // Priority 1: localStorage for this language
    const savedCode = loadCodeFromLocalStorage(currentProblem);
    if (savedCode && savedCode.language === language && savedCode.code.trim()) {
      setCode(savedCode.code);
      console.log(`✅ Loaded localStorage code for language ${language}`);
      return;
    }
    
    // Priority 2: Firebase (solved) - keep the solved code regardless of language
    if (submissions[currentProblem] && submissions[currentProblem].solvedAt) {
      // Don't change code if problem is solved
      return;
    }
    
    // Priority 3: Boilerplate for the new language
    const boilerplate = getBoilerplateCode(currentProblem, language);
    if (boilerplate) {
      setCode(boilerplate);
      console.log(`✅ Loaded boilerplate for language ${language}`);
    }
  }, [language, currentProblem, problems, selectedBranch]); // Watch language changes

  useEffect(() => {
    if (selectedBranch) {
      loadProblems();
    }
  }, [selectedBranch]);

  if (contestEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Contest Ended</h2>
          <p className="text-muted-foreground">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  if (!problems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <FaClock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      </div>
    );
  }

  const currentProblemData = problems[currentProblem];
  const isProblemSolved = solvedProblems.has(currentProblem);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ContestHeader
        selectedBranch={selectedBranch}
        solvedCount={solvedProblems.size}
        totalProblems={problems.length}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onEndContest={endContest}
      />

      <div className="flex-1 flex w-full">
        <ProblemSidebar
          problems={problems}
          currentProblem={currentProblem}
          solvedProblems={solvedProblems}
          switchToProblem={switchToProblem}
          formatProblemTime={formatProblemTime}
          getCurrentProblemTime={getCurrentProblemTime}
          isSE={isSE}
        />

        <div className="flex-1 flex w-full" ref={containerRef}>
          <div 
            className="overflow-y-auto bg-background border-r border-border"
            style={{ width: `${leftWidth}%` }}
          >
            <ProblemStatement problem={currentProblemData} isSE={isSE} />
          </div>

          <div 
            className="w-1 bg-border hover:bg-primary cursor-col-resize flex items-center justify-center group"
            onMouseDown={handleMouseDownHorizontal}
          >
            <FaGripVertical className="text-muted-foreground group-hover:text-primary" size={12} />
          </div>

          <div 
            className="flex flex-col bg-card right-panel"
            style={{ width: `${100 - leftWidth}%` }}
          >
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onSubmit={() => submitSolution(canExecute, recordAttempt, () => saveCodeToLocalStorage(currentProblem, code, language))}
              isSubmitting={isSubmitting}
              isProblemSolved={isProblemSolved}
              canExecute={canExecute}
              topHeight={topHeight}
            />

            <div 
              className="h-1 bg-border hover:bg-primary cursor-row-resize flex items-center justify-center group"
              onMouseDown={handleMouseDownVertical}
            >
              <div className="w-8 h-1 bg-muted-foreground group-hover:bg-primary rounded"></div>
            </div>

            <OutputPanel
              output={output}
              isSubmitting={isSubmitting}
              isProblemSolved={isProblemSolved}
              topHeight={topHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
