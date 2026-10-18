import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

const CONTEST_DURATION = 45 * 60 * 1000;

const LANGUAGES = [
  { id: 'c', name: 'C', template: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}' },
  { id: 'cpp', name: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' },
  { id: 'java', name: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' },
  { id: 'python', name: 'Python', template: '# Your code here\n' },
  { id: 'javascript', name: 'JavaScript', template: '// Your code here\n' }
];

export const useContest = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [contestEnded, setContestEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CONTEST_DURATION);
  const [startTime, setStartTime] = useState(null);
  const [submissions, setSubmissions] = useState({});
  const [problemTimers, setProblemTimers] = useState({});
  const [problemStartTimes, setProblemStartTimes] = useState({});
  const [tabSwitchWarningIssued, setTabSwitchWarningIssued] = useState(false);
  const tabSwitchCountRef = useRef(0);
  const lastHideTimestampRef = useRef(0);

  const isSE = selectedBranch.toUpperCase().includes('SE');

  const formatDateIST = (date = new Date()) => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const parseISTDate = (str) => {
    if (!str) return null;
    const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) (am|pm)$/i);
    if (!match) return null;
    let [, dd, mm, yyyy, hh, min, ss, ampm] = match;
    let hour = parseInt(hh, 10);
    if (ampm.toLowerCase() === 'pm' && hour !== 12) hour += 12;
    if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    return new Date(`${yyyy}-${mm}-${dd}T${hour.toString().padStart(2, '0')}:${min}:${ss}+05:30`);
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatProblemTime = (milliseconds) => {
    if (!milliseconds) return "00:00";
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentProblemTime = (problemIndex) => {
    const baseTime = problemTimers[problemIndex] || 0;
    const startTime = problemStartTimes[problemIndex];
    if (startTime) {
      return baseTime + (Date.now() - startTime);
    }
    return baseTime;
  };

  const loadProblems = async () => {
    try {
      const isCurrentBranchSE = selectedBranch.toUpperCase().includes('SE');
      const docName = isCurrentBranchSE ? 'se-contest' : 'contest';
      
      const docRef = doc(db, 'problems', docName);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const problemsData = docSnap.data().problems || [];
        setProblems(problemsData);
      } else {
        setProblems([]);
      }
    } catch (error) {
      console.error('Error loading problems:', error);
      toast.error('Failed to load problems');
    }
  };

  const initializeResults = async (branch) => {
    try {
      const docRef = doc(db, 'results', branch);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          solvedCount: 0,
          startTime: formatDateIST(),
          problemTimers: {},
          submissions: {}
        });
      } else {
        const data = docSnap.data();
        
        if (data.contestEnded) {
          toast.error('Contest has already been completed for this branch');
          navigate('/');
          return;
        }
        
        if (data.problemTimers) {
          setProblemTimers(data.problemTimers);
        }
        
        if (data.submissions) {
          setSubmissions(data.submissions);
          
          const solved = new Set();
          Object.keys(data.submissions).forEach(problemIndex => {
            const submission = data.submissions[problemIndex];
            if (submission.solvedAt) {
              solved.add(parseInt(problemIndex));
            }
          });
          setSolvedProblems(solved);
        }
        
        if (data.startTime) {
          const contestStartTime = parseISTDate(data.startTime);
          if (contestStartTime) {
            setStartTime(contestStartTime.getTime());
            localStorage.setItem(`contest_started_${branch}`, contestStartTime.getTime().toString());
          }
        }
      }
    } catch (error) {
      console.error('Error initializing results:', error);
    }
  };

  // **NEW: Helper function to get boilerplate code**
  const getBoilerplateCode = (problemIndex, lang) => {
    if (problems[problemIndex]?.boilerplate?.[lang]) {
      return problems[problemIndex].boilerplate[lang];
    }
    const langTemplate = LANGUAGES.find(l => l.id === lang);
    return langTemplate ? langTemplate.template : '';
  };

  const endContest = async () => {
    try {
      const finalSubmissions = { ...submissions };
      
      if (!solvedProblems.has(currentProblem)) {
        finalSubmissions[currentProblem] = {
          ...finalSubmissions[currentProblem],
          code: code,
          language: language,
          timeSpent: getCurrentProblemTime(currentProblem),
          lastSaved: formatDateIST()
        };
      }
      
      for (let i = 0; i < problems.length; i++) {
        if (!solvedProblems.has(i)) {
          const key = `contest_${selectedBranch}_problem_${i}`;
          const saved = localStorage.getItem(key);
          
          if (saved) {
            try {
              const { code: savedCode, language: savedLanguage } = JSON.parse(saved);
              if (savedCode && savedCode.trim()) {
                finalSubmissions[i] = {
                  ...finalSubmissions[i],
                  code: savedCode,
                  language: savedLanguage,
                  timeSpent: getCurrentProblemTime(i),
                  lastSaved: formatDateIST()
                };
              }
            } catch (error) {
              console.error('Error parsing saved code:', error);
            }
          }
        }
      }

      const docRef = doc(db, 'results', selectedBranch);
      await updateDoc(docRef, {
        problemTimers: problemTimers,
        submissions: finalSubmissions,
        endTime: formatDateIST(),
        contestEnded: true,
        endedBy: 'user'
      });
      
      localStorage.removeItem(`contest_started_${selectedBranch}`);
      for (let i = 0; i < problems.length; i++) {
        localStorage.removeItem(`contest_${selectedBranch}_problem_${i}`);
        localStorage.removeItem(`contest_${selectedBranch}_timer_${i}`);
        localStorage.removeItem(`contest_${selectedBranch}_starttime_${i}`);
      }
    } catch (error) {
      console.error('Error saving final state:', error);
    }

    setContestEnded(true);
    toast.info('Contest ended');
    setTimeout(() => navigate('/'), 2000);
  };

  return {
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
    setSolvedProblems,
    contestEnded,
    timeLeft,
    setTimeLeft,
    startTime,
    setStartTime,
    submissions,
    setSubmissions,
    problemTimers,
    setProblemTimers,
    problemStartTimes,
    setProblemStartTimes,
    tabSwitchWarningIssued,
    setTabSwitchWarningIssued,
    tabSwitchCountRef,
    lastHideTimestampRef,
    isSE,
    formatDateIST,
    parseISTDate,
    formatTime,
    formatProblemTime,
    getCurrentProblemTime,
    loadProblems,
    initializeResults,
    endContest,
    getBoilerplateCode,
    navigate,
    CONTEST_DURATION
  };
};
