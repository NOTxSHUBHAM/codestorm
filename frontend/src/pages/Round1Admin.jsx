import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FaPlus, FaTrash, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import ThemeToggle from '../components/contest/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

const Round1Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [problems, setProblems] = useState([]);
  const [activeTab, setActiveTab] = useState('questions');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for admin authentication
    if (localStorage.getItem('adminAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProblems();
      if (activeTab === 'rankings') {
        loadRankings();
      }
      // Persist authentication
      localStorage.setItem('adminAuthenticated', 'true');
    }
  }, [isAuthenticated, activeTab]);

  const authenticate = () => {
    if (secretKey === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast.success('Authenticated successfully!');
    } else {
      toast.error('Invalid secret key');
    }
  };

  const loadProblems = async () => {
    try {
      const docRef = doc(db, 'problems', 'contest');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProblems(docSnap.data().problems || []);
      } else {
        // Initialize with empty problems
        setProblems(Array(5).fill().map(() => ({
          title: '',
          description: '',
          examples: [{ input: '', output: '' }],
          constraints: [''],
          testCases: [{ input: '', output: '' }],
          boilerplate: {
            c: '',
            cpp: '',
            java: '',
            python: '',
            javascript: ''
          }
        })));
      }
    } catch (error) {
      console.error('Error loading problems:', error);
      toast.error('Failed to load problems');
    }
  };

  const loadRankings = async () => {
    setLoading(true);
    try {
      const resultsRef = collection(db, 'results');
      const snapshot = await getDocs(resultsRef);

      const allResults = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        let solvingCount = 0;
        let debuggingCount = 0;
        let totalSolvedTime = 0; // **NEW: Sum of times for solved problems**
        
        if (data.submissions) {
          Object.keys(data.submissions).forEach(problemIndex => {
            const problemIdx = parseInt(problemIndex);
            const submission = data.submissions[problemIndex];
            
            if (submission.solvedAt) {
              // **NEW: Add time spent on this solved problem**
              totalSolvedTime += submission.timeSpent || 0;
              
              if (doc.id.toUpperCase().includes('SE')) {
                if (problemIdx < 2) {
                  solvingCount++;
                } else {
                  debuggingCount++;
                }
              } else {
                solvingCount++;
              }
            }
          });
        }

        allResults.push({
          branch: doc.id,
          solvedCount: data.solvedCount || 0,
          solvingCount: solvingCount,
          debuggingCount: debuggingCount,
          startTime: data.startTime,
          endTime: data.endTime,
          totalSolvedTime: totalSolvedTime // **NEW**
        });
      });

      function parseISTDate(str) {
        if (!str) return null;
        const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) (am|pm)$/i);
        if (!match) return null;
        let [ , dd, mm, yyyy, hh, min, ss, ampm ] = match;
        let hour = parseInt(hh, 10);
        if (ampm.toLowerCase() === 'pm' && hour !== 12) hour += 12;
        if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
        return new Date(`${yyyy}-${mm}-${dd}T${hour.toString().padStart(2, '0')}:${min}:${ss}+05:30`);
      }

      const resultsWithTime = allResults.map(result => {
        let timeTaken = 0;
        const startDate = parseISTDate(result.startTime);
        const endDate = parseISTDate(result.endTime);
        if (startDate && endDate) {
          timeTaken = endDate.getTime() - startDate.getTime();
        }
        return {
          ...result,
          timeTaken
        };
      });

      const seTeams = resultsWithTime.filter(team => team.branch.toUpperCase().includes('SE'));
      const nonSeTeams = resultsWithTime.filter(team => !team.branch.toUpperCase().includes('SE'));

      // **UPDATED: Sort with tie-breaking by totalSolvedTime**
      seTeams.sort((a, b) => {
        if (a.solvedCount !== b.solvedCount) {
          return b.solvedCount - a.solvedCount;
        }
        if (a.solvingCount !== b.solvingCount) {
          return b.solvingCount - a.solvingCount;
        }
        if (a.timeTaken !== b.timeTaken) {
          return a.timeTaken - b.timeTaken;
        }
        // **NEW: If same time taken, use sum of solved problem times (lower is better)**
        return a.totalSolvedTime - b.totalSolvedTime;
      });

      nonSeTeams.sort((a, b) => {
        if (a.solvedCount !== b.solvedCount) {
          return b.solvedCount - a.solvedCount;
        }
        if (a.timeTaken !== b.timeTaken) {
          return a.timeTaken - b.timeTaken;
        }
        // **NEW: If same time taken, use sum of solved problem times (lower is better)**
        return a.totalSolvedTime - b.totalSolvedTime;
      });

      const qualifiedTeams = [
        ...seTeams.slice(0, 2),
        ...nonSeTeams.slice(0, 4)
      ];

      // **UPDATED: Sort all teams with tie-breaking**
      const allSortedTeams = resultsWithTime.sort((a, b) => {
        if (a.solvedCount !== b.solvedCount) {
          return b.solvedCount - a.solvedCount;
        }
        const aIsSE = a.branch.toUpperCase().includes('SE');
        const bIsSE = b.branch.toUpperCase().includes('SE');
        if (aIsSE && bIsSE && a.solvingCount !== b.solvingCount) {
          return b.solvingCount - a.solvingCount;
        }
        if (a.timeTaken !== b.timeTaken) {
          return a.timeTaken - b.timeTaken;
        }
        // **NEW: Tie-breaker**
        return a.totalSolvedTime - b.totalSolvedTime;
      });

      const rankedTeams = allSortedTeams.map(team => ({
        ...team,
        isQualified: qualifiedTeams.some(qualified => qualified.branch === team.branch)
      }));

      setRankings(rankedTeams);
    } catch (error) {
      console.error('Error loading rankings:', error);
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds) return 'N/A';
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const saveProblems = async () => {
    try {
      // Clean up problems before saving - trim whitespace and normalize outputs
      const cleanedProblems = problems.map(problem => ({
        ...problem,
        testCases: problem.testCases.map(testCase => ({
          input: testCase.input.trim(),
          output: testCase.output.trim()
        })),
        examples: problem.examples.map(example => ({
          input: example.input.trim(),
          output: example.output.trim()
        }))
      }));
      
      const docRef = doc(db, 'problems', 'contest');
      await setDoc(docRef, { problems: cleanedProblems });
      toast.success('Problems saved successfully!');
    } catch (error) {
      console.error('Error saving problems:', error);
      toast.error('Failed to save problems');
    }
  };

  const updateProblem = (index, field, value) => {
    const newProblems = [...problems];
    newProblems[index] = { ...newProblems[index], [field]: value };
    setProblems(newProblems);
  };

  const updateNestedField = (problemIndex, field, itemIndex, subField, value) => {
    const newProblems = [...problems];
    const newArray = [...newProblems[problemIndex][field]];
    newArray[itemIndex] = { ...newArray[itemIndex], [subField]: value };
    newProblems[problemIndex] = { ...newProblems[problemIndex], [field]: newArray };
    setProblems(newProblems);
  };

  const addArrayItem = (problemIndex, field, defaultItem) => {
    const newProblems = [...problems];
    newProblems[problemIndex] = {
      ...newProblems[problemIndex],
      [field]: [...newProblems[problemIndex][field], defaultItem]
    };
    setProblems(newProblems);
  };

  const removeArrayItem = (problemIndex, field, itemIndex) => {
    const newProblems = [...problems];
    newProblems[problemIndex] = {
      ...newProblems[problemIndex],
      [field]: newProblems[problemIndex][field].filter((_, i) => i !== itemIndex)
    };
    setProblems(newProblems);
  };

const generatePDFReports = async () => {
  try {
    const resultsRef = collection(db, 'results');
    const snapshot = await getDocs(resultsRef);
    
    const zip = new JSZip();
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const branch = docSnap.id;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPos = 20;
      
      // Helper function to check if we need a new page
      const checkPageBreak = (requiredHeight) => {
        if (yPos + requiredHeight > 280) { // Leave margin at bottom
          pdf.addPage();
          yPos = 20;
          return true;
        }
        return false;
      };
      
      // Title with better styling
      pdf.setFillColor(59, 130, 246); // Blue background
      pdf.rect(0, 0, 210, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.text(`Contest Report`, 105, 20, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text(`${branch}`, 105, 27, { align: 'center' });
      
      yPos = 45;
      pdf.setTextColor(0, 0, 0);
      
      // Summary Section with background
      checkPageBreak(35);
      pdf.setFillColor(248, 250, 252);
      pdf.rect(15, yPos - 5, 180, 30, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(15, yPos - 5, 180, 30, 'S');
      
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Contest Summary', 20, yPos + 5);
      
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Start Time: ${data.startTime || 'N/A'}`, 20, yPos + 12);
      pdf.text(`End Time: ${data.endTime || 'N/A'}`, 20, yPos + 18);
      pdf.text(`Problems Solved: ${data.solvedCount || 0}`, 20, yPos + 24);
      
      yPos += 40;
      
      // Problem-wise details
      if (data.submissions && Object.keys(data.submissions).length > 0) {
        checkPageBreak(20);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Problem-wise Submissions', 20, yPos);
        yPos += 15;
        
        Object.entries(data.submissions).forEach(([problemIndex, submission], index) => {
          // Calculate required height for this problem
          const codeLines = submission.code ? Math.ceil(submission.code.length / 80) : 0;
          const estimatedCodeHeight = Math.min(60, codeLines * 3 + 10);
          const problemHeight = 50 + estimatedCodeHeight;
          
          // Check if we need a new page
          checkPageBreak(problemHeight);
          
          // Problem header with background
          pdf.setFillColor(239, 246, 255);
          pdf.rect(15, yPos - 2, 180, 8, 'F');
          pdf.setDrawColor(191, 219, 254);
          pdf.rect(15, yPos - 2, 180, 8, 'S');
          
          pdf.setFontSize(14);
          pdf.setFont(undefined, 'bold');
          pdf.setTextColor(29, 78, 216);
          pdf.text(`Problem ${parseInt(problemIndex) + 1}`, 20, yPos + 4);
          
          // Status badge
          if (submission.solvedAt) {
            pdf.setFillColor(34, 197, 94);
            pdf.setTextColor(255, 255, 255);
            pdf.rect(160, yPos - 1, 25, 6, 'F');
            pdf.setFontSize(10);
            pdf.text('SOLVED', 172, yPos + 3, { align: 'center' });
          } else {
            pdf.setFillColor(239, 68, 68);
            pdf.setTextColor(255, 255, 255);
            pdf.rect(155, yPos - 1, 30, 6, 'F');
            pdf.setFontSize(10);
            pdf.text('ATTEMPTED', 170, yPos + 3, { align: 'center' });
          }
          
          yPos += 12;
          pdf.setTextColor(0, 0, 0);
          
          // Problem details in a box
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(226, 232, 240);
          pdf.rect(15, yPos, 180, 25, 'FD');
          
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          pdf.text(`Language: ${submission.language?.toUpperCase() || 'N/A'}`, 20, yPos + 6);
          pdf.text(`Time Spent: ${formatTime(submission.timeSpent || 0)}`, 20, yPos + 12);
          if (submission.solvedAt) {
            pdf.text(`Solved At: ${submission.solvedAt}`, 20, yPos + 18);
          } else {
            pdf.text(`Last Saved: ${submission.lastSaved || 'N/A'}`, 20, yPos + 18);
          }
          
          yPos += 30;
          
          // Code section with better handling
          if (submission.code && submission.code.trim()) {
            // Check if we need a new page for code
            checkPageBreak(40);
            
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('Code:', 20, yPos);
            yPos += 8;
            
            // Split code into manageable chunks
            const maxCharsPerPage = 2000; // Adjust based on testing
            const codeChunks = [];
            let currentChunk = '';
            const lines = submission.code.split('\n');
            
            for (const line of lines) {
              if ((currentChunk + line + '\n').length > maxCharsPerPage) {
                if (currentChunk) {
                  codeChunks.push(currentChunk);
                  currentChunk = line + '\n';
                } else {
                  // Single line is too long, truncate it
                  codeChunks.push(line.substring(0, maxCharsPerPage) + '...[line truncated]');
                  currentChunk = '';
                }
              } else {
                currentChunk += line + '\n';
              }
            }
            if (currentChunk) {
              codeChunks.push(currentChunk);
            }
            
            // Render each chunk
            codeChunks.forEach((chunk, chunkIndex) => {
              const lines = pdf.splitTextToSize(chunk, 170);
              const requiredHeight = lines.length * 3 + 10;
              
              // Check if we need a new page for this chunk
              if (checkPageBreak(requiredHeight)) {
                // Add continuation note if this is not the first chunk
                if (chunkIndex > 0) {
                  pdf.setFontSize(10);
                  pdf.setFont(undefined, 'italic');
                  pdf.text('...continued from previous page', 20, yPos);
                  yPos += 5;
                }
              }
              
              // Code background
              const actualHeight = Math.min(requiredHeight, 280 - yPos - 10);
              pdf.setFillColor(248, 250, 252);
              pdf.rect(15, yPos - 3, 180, actualHeight, 'F');
              pdf.setDrawColor(203, 213, 225);
              pdf.rect(15, yPos - 3, 180, actualHeight, 'S');
              
              // Code content
              pdf.setFontSize(8);
              pdf.setFont('courier', 'normal');
              
              // Calculate how many lines we can fit
              const availableHeight = actualHeight - 6;
              const maxLines = Math.floor(availableHeight / 3);
              const displayLines = lines.slice(0, maxLines);
              
              pdf.text(displayLines, 18, yPos + 2);
              
              yPos += actualHeight + 5;
              
              // Add continuation note if there are more chunks
              if (chunkIndex < codeChunks.length - 1) {
                pdf.setFontSize(10);
                pdf.setFont(undefined, 'italic');
                pdf.text('...continued on next page', 20, yPos);
                yPos += 5;
              }
            });
          } else {
            // No code submitted
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'italic');
            pdf.setTextColor(107, 114, 128);
            pdf.text('No code submitted for this problem.', 20, yPos);
            pdf.setTextColor(0, 0, 0);
            yPos += 10;
          }
          
          yPos += 10; // Space between problems
        });
      } else {
        checkPageBreak(20);
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'italic');
        pdf.setTextColor(107, 114, 128);
        pdf.text('No submissions found for this team.', 20, yPos);
      }
      
      // Footer on all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 20, 290);
        pdf.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
        pdf.text(`Team: ${branch}`, 105, 290, { align: 'center' });
      }
      
      // Add to zip
      const pdfBlob = pdf.output('blob');
      zip.file(`${branch}_detailed_report.pdf`, pdfBlob);
    }
    
    // Download zip
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contest_reports_${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Enhanced reports downloaded successfully!');
  } catch (error) {
    console.error('Error generating reports:', error);
    toast.error('Failed to generate reports');
  }
};

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-md w-full space-y-4 p-6 relative">
          {/* Theme toggle button in top-right */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-bold text-center">Admin Access</h1>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-2 pr-12 border border-border rounded-lg bg-background"
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={authenticate}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">TE/BE Problems Admin</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/round-1/se-admin')}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              SE Problems Admin
            </button>
            <ThemeToggle />
            {activeTab === 'questions' && (
              <button
                onClick={saveProblems}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <FaSave className="h-4 w-4" />
                Save All Problems
              </button>
            )}
            {activeTab === 'rankings' && (
              <button
                onClick={loadRankings}
                disabled={loading}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh Rankings'}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm text-foreground ${
                  activeTab === 'questions'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                Questions
              </button>
              <button
                onClick={() => setActiveTab('rankings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm text-foreground ${
                  activeTab === 'rankings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                Rankings
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm text-foreground ${
                  activeTab === 'reports'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                Reports
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'questions' && (
          <div className="space-y-8">
            {problems.map((problem, problemIndex) => (
              <div
                key={problemIndex}
                className="bg-card border border-border rounded-lg p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold mb-4">Problem {problemIndex + 1}</h2>
                
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={problem.title}
                    onChange={(e) => updateProblem(problemIndex, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={problem.description}
                    onChange={(e) => updateProblem(problemIndex, 'description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Examples */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Examples</label>
                    <button
                      onClick={() => addArrayItem(problemIndex, 'examples', { input: '', output: '' })}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-secondary/90 transition-colors"
                    >
                      <FaPlus className="h-3 w-3" />
                      Add Example
                    </button>
                  </div>
                  {problem.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="bg-muted p-4 rounded-lg mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Example {exampleIndex + 1}</span>
                        <button
                          onClick={() => removeArrayItem(problemIndex, 'examples', exampleIndex)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1">Input</label>
                          <textarea
                            value={example.input}
                            onChange={(e) => updateNestedField(problemIndex, 'examples', exampleIndex, 'input', e.target.value)}
                            className="w-full px-2 py-1 border border-border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            rows={2}
                            placeholder="Enter input..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Output</label>
                          <textarea
                            value={example.output}
                            onChange={(e) => updateNestedField(problemIndex, 'examples', exampleIndex, 'output', e.target.value)}
                            className="w-full px-2 py-1 border border-border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            rows={2}
                            placeholder="Enter expected output..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Constraints</label>
                    <button
                      onClick={() => addArrayItem(problemIndex, 'constraints', '')}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-secondary/90 transition-colors"
                    >
                      <FaPlus className="h-3 w-3" />
                      Add Constraint
                    </button>
                  </div>
                  {problem.constraints.map((constraint, constraintIndex) => (
                    <div key={constraintIndex} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={constraint}
                        onChange={(e) => {
                          const newConstraints = [...problem.constraints];
                          newConstraints[constraintIndex] = e.target.value;
                          updateProblem(problemIndex, 'constraints', newConstraints);
                        }}
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter constraint..."
                      />
                      <button
                        onClick={() => removeArrayItem(problemIndex, 'constraints', constraintIndex)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Test Cases */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Test Cases</label>
                    <button
                      onClick={() => addArrayItem(problemIndex, 'testCases', { input: '', output: '' })}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-secondary/90 transition-colors"
                    >
                      <FaPlus className="h-3 w-3" />
                      Add Test Case
                    </button>
                  </div>
                  {problem.testCases.map((testCase, testIndex) => (
                    <div key={testIndex} className="bg-muted p-4 rounded-lg mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Test Case {testIndex + 1}</span>
                        <button
                          onClick={() => removeArrayItem(problemIndex, 'testCases', testIndex)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1">Input</label>
                          <textarea
                            value={testCase.input}
                            onChange={(e) => updateNestedField(problemIndex, 'testCases', testIndex, 'input', e.target.value)}
                            className="w-full px-2 py-1 border border-border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                            rows={3}
                            placeholder="Enter test input..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Expected Output</label>
                          <textarea
                            value={testCase.output}
                            onChange={(e) => updateNestedField(problemIndex, 'testCases', testIndex, 'output', e.target.value)}
                            className="w-full px-2 py-1 border border-border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                            rows={3}
                            placeholder="Enter expected output (exact match)..."
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Note: Output will be trimmed of whitespace for comparison
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boilerplate Code */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Boilerplate Code</label>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(problem.boilerplate).map(([lang, code]) => (
                      <div key={lang}>
                        <label className="block text-xs font-medium mb-1 capitalize">{lang}</label>
                        <textarea
                          value={code}
                          onChange={(e) => updateProblem(problemIndex, 'boilerplate', {
                            ...problem.boilerplate,
                            [lang]: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={6}
                          placeholder={`Enter ${lang} boilerplate code...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rankings' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Contest Rankings (Top 6 Qualified Teams Highlighted)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Qualification: Top 2 SE teams + Top 4 TE/BE teams
            </p>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading rankings...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">Team/Branch</th>
                      <th className="text-left py-3 px-4 font-medium">Total Solved</th>
                      <th className="text-left py-3 px-4 font-medium">Solving</th>
                      <th className="text-left py-3 px-4 font-medium">Debugging</th>
                      <th className="text-left py-3 px-4 font-medium">Time Taken</th>
                      <th className="text-left py-3 px-4 font-medium">Start Time</th>
                      <th className="text-left py-3 px-4 font-medium">End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((team, index) => (
                      <tr 
                        key={team.branch} 
                        className={`border-b border-border hover:bg-muted/50 ${
                          team.isQualified ? 'bg-green-50 dark:bg-green-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold">#{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              team.branch.toUpperCase().includes('SE') 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {team.branch}
                            </span>
                            {team.isQualified && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                                QUALIFIED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">{team.solvedCount}</td>
                        <td className="py-3 px-4">{team.solvingCount}</td>
                        <td className="py-3 px-4">
                          {team.branch.toUpperCase().includes('SE') ? team.debuggingCount : 'N/A'}
                        </td>
                        <td className="py-3 px-4">{formatTime(team.timeTaken)}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {team.startTime || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {team.endTime || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {rankings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No teams have participated yet
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Download Team Reports</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Generate PDF reports for each team with problem-wise time and submitted code
            </p>
            <button
              onClick={generatePDFReports}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Download All Reports (ZIP)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Round1Admin;
