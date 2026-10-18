import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FaPlus, FaTrash, FaSave, FaEye, FaEyeSlash, FaStar } from 'react-icons/fa';
import { toast } from 'sonner';
import ThemeToggle from '../components/contest/ThemeToggle';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Round1SEAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProblems();
      localStorage.setItem('adminAuthenticated', 'true');
    }
  }, [isAuthenticated]);

  const authenticate = () => {
    if (secretKey === import.meta.env.VITE_ADMIN_SECRET) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast.success('Authenticated successfully!');
    } else {
      toast.error('Invalid secret key');
    }
  };

  const loadProblems = async () => {
    try {
      const docRef = doc(db, 'problems', 'se-contest');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProblems(docSnap.data().problems || []);
      } else {
        // Initialize with correct problem types
        const initialProblems = [
          // 2 Solving problems
          ...Array(2).fill().map((_, index) => ({
            title: `Solving Problem ${index + 1}`,
            description: '',
            type: 'solving', 
            examples: [{ input: '', output: '' }],
            constraints: [''],
            testCases: [{ input: '', output: '' }],
            boilerplate: {
              c: '',
              cpp: '',
              java: '',
              python: '',
              javascript: ''
            },
            dropdownOpen: false
          })),
          ...Array(3).fill().map((_, index) => ({
            title: `Debugging Problem ${index + 1}`,
            description: '',
            type: 'debugging', 
            examples: [{ input: '', output: '' }],
            constraints: [''],
            testCases: [{ input: '', output: '' }],
            boilerplate: {
              c: '',
              cpp: '',
              java: '',
              python: '',
              javascript: ''
            },
            dropdownOpen: false
          }))
        ];
        setProblems(initialProblems);
        
        // AUTO-SAVE the initial structure
        const docRef = doc(db, 'problems', 'se-contest');
        await setDoc(docRef, { problems: initialProblems });
        toast.success('Initialized SE problems structure');
      }
    } catch (error) {
      console.error('Error loading problems:', error);
      toast.error('Failed to load problems');
    }
  };

  const saveProblems = async () => {
    try {
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
      const docRef = doc(db, 'problems', 'se-contest');
      await setDoc(docRef, { problems: cleanedProblems });
      toast.success('SE Problems saved successfully!');
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-md w-full space-y-4 p-6 relative">
          {/* Theme toggle button in top-right */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-bold text-center">SE Admin Access</h1>
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
          <h1 className="text-3xl font-bold">SE Problems Admin</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/round-1/admin')}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              TE/BE Problems Admin
            </button>
            <ThemeToggle />
            <button
              onClick={saveProblems}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <FaSave className="h-4 w-4" />
              Save All SE Problems
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {problems.map((problem, problemIndex) => (
            <div
              key={problemIndex}
              className="bg-card border border-border rounded-lg p-6 shadow-lg text-foreground"
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold">
                  Problem {problemIndex + 1}
                </h2>
                {problem.type === 'solving' && (
                  <FaStar className="h-5 w-5 text-yellow-500" title="Higher marks" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  problem.type === 'solving' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {problem.type === 'solving' ? 'Solving' : 'Debugging'}
                </span>
              </div>
              
              {/* Problem Type Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Problem Type</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-left flex items-center justify-between hover:bg-accent transition-colors"
                    onClick={() => updateProblem(problemIndex, 'dropdownOpen', !problem.dropdownOpen)}
                  >
                    <span className="text-foreground">
                      {problem.type === 'solving' ? 'Solving' : 'Debugging'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${problem.dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {problem.dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-md z-10">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors rounded-t-lg"
                        onClick={() => {
                          updateProblem(problemIndex, 'type', 'solving');
                          updateProblem(problemIndex, 'dropdownOpen', false);
                        }}
                      >
                        Solving
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors rounded-b-lg"
                        onClick={() => {
                          updateProblem(problemIndex, 'type', 'debugging');
                          updateProblem(problemIndex, 'dropdownOpen', false);
                        }}
                      >
                        Debugging
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
      </div>
    </div>
  );
};

export default Round1SEAdmin;
