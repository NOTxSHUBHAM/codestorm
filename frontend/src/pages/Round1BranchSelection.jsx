import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ThemeToggle from '../components/contest/ThemeToggle';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '../lib/firebase';

const BRANCHES = [
  "SE CA",
  "SE CB", 
  "SE CC",
  "SE CSE",
  "SE ECS",
  "SE MECH",
  "TE CA",
  "TE CB",
  "TE ECS",
  "TE AIDS",
  "TE MECH",
  "BE CA",
  "BE CB",
  "BE ECS",
  "BE AIDS",
  "BE MECH",
];

const BRANCH_CODES = {
"SE CA": "4821",
"SE CB": "7094",
"SE CC": "1568",
"SE CSE": "8340",
"SE ECS": "2917",
"SE MECH": "6403",
"TE CA": "3572",
"TE CB": "9081",
"TE ECS": "4725",
"TE AIDS": "6139",
"TE MECH": "2846",
"BE CA": "7910",
"BE CB": "4306",
"BE ECS": "2654",
"BE AIDS": "9872",
"BE MECH": "5083"
};

const BranchSelection = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBranch || !classCode) {
      toast.error('Please select a branch and enter the passcode');
      return;
    }

    if (BRANCH_CODES[selectedBranch] !== classCode) {
      toast.error('Invalid passcode for selected branch');
      return;
    }

    // Check if contest was already ended for this branch
    try {
      const docRef = doc(db, 'results', selectedBranch);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.contestEnded) {
          toast.error('Contest has already been completed for this branch');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking contest status:', error);
    }

    localStorage.setItem('selectedBranch', selectedBranch);
    navigate('/round-1/contest');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-background text-foreground">
      {/* Theme toggle button in top-right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Round 1</h1>
          <p className="text-muted-foreground">Select your class to begin the coding challenge</p>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-left flex items-center justify-between hover:bg-accent transition-colors"
            >
              <span className={selectedBranch ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedBranch || 'Select your class'}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
                {BRANCHES.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setIsDropdownOpen(false);
                      setClassCode('');
                      setError('');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {branch}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4-digit code input with eye button */}
          <div className="relative">
            <input
              type={showCode ? 'text' : 'password'}
              maxLength={4}
              value={classCode}
              onChange={e => {
                setClassCode(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              disabled={!selectedBranch}
              placeholder="Enter 4-digit code for your class"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-left text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showCode ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={!selectedBranch || classCode.length !== 4}
            className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Start Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchSelection;
