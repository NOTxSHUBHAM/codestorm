import { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { submitCodeBatch, getSubmissionBatchResult } from '../lib/judge0';
import { toast } from 'sonner';

export const useCodeSubmission = ({
  selectedBranch,
  problems,
  currentProblem,
  code,
  language,
  getCurrentProblemTime,
  formatDateIST,
  problemTimers,
  submissions,
  setSubmissions,
  setSolvedProblems
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState('');

  const submitSolution = async (canExecute, recordAttempt, saveCodeToLocalStorage) => {
    if (!canExecute()) {
      toast.error('Rate limit exceeded. Try again later.');
      return;
    }

    if (!problems[currentProblem]?.testCases?.length) {
      toast.error('No test cases available');
      return;
    }

    setIsSubmitting(true);
    setOutput('');
    recordAttempt();
    
    try {
      const problem = problems[currentProblem];
      
      const cleanTestCases = problem.testCases.map(testCase => {
        let cleanInput = testCase.input;
        let cleanOutput = testCase.output;
        
        if (typeof testCase.input === 'object' && testCase.input !== null) {
          cleanInput = testCase.input.toString();
        }
        if (typeof testCase.output === 'object' && testCase.output !== null) {
          cleanOutput = testCase.output.toString();
        }
        
        return {
          input: cleanInput.toString().trim(),
          output: cleanOutput.toString().trim()
        };
      });

      const submissionBatch = cleanTestCases.map(testCase => ({
        code,
        language,
        input: testCase.input
      }));

      setOutput(`Submitting ${submissionBatch.length} test cases...`);
      
      const batchResult = await submitCodeBatch(submissionBatch);
      const tokens = batchResult.map(result => result?.token).filter(Boolean);
      
      if (tokens.length === 0) {
        setOutput('Failed to submit test cases - no tokens received');
        toast.error('Failed to submit test cases');
        return;
      }

      let results = [];
      let attempts = 0;
      const maxAttempts = 20;
      
      setOutput('Running test cases...');
      
      do {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          results = await getSubmissionBatchResult(tokens);
        } catch (error) {
          console.error('Error getting results:', error);
          setOutput(`Error getting results: ${error.message}`);
          return;
        }
        
        attempts++;
        
        const allDone = results.every(result => 
          result.status !== 'In Queue' && result.status !== 'Processing'
        );
        
        if (allDone) break;
        
        setOutput(`Running test cases... (${attempts}/${maxAttempts})`);
      } while (attempts < maxAttempts);

      if (!results || results.length === 0) {
        setOutput('No results received from test execution');
        toast.error('Failed to get test results');
        return;
      }

      let allPassed = true;
      let failedTestCase = -1;
      let outputDetails = '';

      for (let i = 0; i < Math.min(results.length, cleanTestCases.length); i++) {
        const result = results[i];
        const testCase = cleanTestCases[i];
        
        if (result.statusId !== 3 || result.output.trim() !== testCase.output) {
          allPassed = false;
          failedTestCase = i + 1;
          
          // **UPDATED: Show detailed test case information**
          outputDetails += `Test Case ${i + 1}/${results.length} Failed\n`;
          outputDetails += `${'='.repeat(50)}\n\n`;
          
          outputDetails += `Input:\n${testCase.input}\n\n`;
          outputDetails += `Expected Output:\n${testCase.output}\n\n`;
          
          if (result.error) {
            outputDetails += `Error:\n${result.error}\n\n`;
          } else if (result.status !== 'Accepted') {
            outputDetails += `Status: ${result.status}\n\n`;
            if (result.output) {
              outputDetails += `Your Output:\n${result.output.trim()}\n\n`;
            }
          } else {
            outputDetails += `Your Output:\n${result.output.trim()}\n\n`;
          }
          
          // Show comparison if both outputs exist
          if (result.output && result.output.trim() !== testCase.output) {
            outputDetails += `Comparison:\n`;
            outputDetails += `Expected: "${testCase.output}"\n`;
            outputDetails += `Got:      "${result.output.trim()}"\n`;
          }
          
          outputDetails += `${'='.repeat(50)}\n`;
          break;
        }
      }

      if (allPassed) {
        const newSubmissions = {
          ...submissions,
          [currentProblem]: {
            code,
            language,
            timeSpent: getCurrentProblemTime(currentProblem),
            solvedAt: formatDateIST()
          }
        };
        setSubmissions(newSubmissions);
        setSolvedProblems(prev => new Set([...prev, currentProblem]));
        
        const docRef = doc(db, 'results', selectedBranch);
        await updateDoc(docRef, {
          solvedCount: increment(1),
          problemTimers: problemTimers,
          submissions: newSubmissions
        });
        
        const key = `contest_${selectedBranch}_problem_${currentProblem}`;
        localStorage.removeItem(key);
        
        setOutput(`All test cases passed! Problem solved successfully.`);
        toast.success('Problem solved successfully!');
      } else {
        saveCodeToLocalStorage();
        setOutput(outputDetails);
        toast.error(`Test case ${failedTestCase} failed`);
      }
      
    } catch (error) {
      console.error('Error submitting solution:', error);
      setOutput('Error: ' + error.message);
      toast.error('Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    output,
    submitSolution,
    setOutput
  };
};
