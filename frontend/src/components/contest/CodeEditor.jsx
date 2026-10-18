import React from 'react';
import Editor from '@monaco-editor/react';
import { FaPlay } from 'react-icons/fa';

const LANGUAGES = [
  { id: 'c', name: 'C', template: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}' },
  { id: 'cpp', name: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' },
  { id: 'java', name: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' },
  { id: 'python', name: 'Python', template: '# Your code here\n' },
  { id: 'javascript', name: 'JavaScript', template: '// Your code here\n' }
];

const CodeEditor = ({ 
  code, 
  setCode, 
  language, 
  setLanguage, 
  onSubmit, 
  isSubmitting, 
  isProblemSolved, 
  canExecute, 
  topHeight 
}) => {
  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-border">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isProblemSolved}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>
        
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !canExecute() || isProblemSolved}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          <FaPlay className="h-4 w-4" />
          {isProblemSolved ? 'Solved' : isSubmitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </div>

      <div 
        className="bg-background"
        style={{ height: `${topHeight}%` }}
      >
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={isProblemSolved ? undefined : setCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            readOnly: isProblemSolved
          }}
        />
      </div>
    </>
  );
};

export default CodeEditor;
