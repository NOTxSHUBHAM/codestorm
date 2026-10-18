import React from 'react';

const OutputPanel = ({ output, isSubmitting, isProblemSolved, topHeight }) => {
  return (
    <div 
      className="bg-background border-t border-border p-4 overflow-y-auto"
      style={{ height: `${100 - topHeight}%` }}
    >
      <h4 className="font-semibold mb-2">Output:</h4>
      <pre className="text-sm whitespace-pre-wrap text-muted-foreground font-mono">
        {isProblemSolved 
          ? 'Problem solved! Code submission locked.'
          : isSubmitting 
          ? 'Submitting and running test cases...' 
          : output || 'No output yet. Click "Submit Solution" to run all test cases.'
        }
      </pre>
    </div>
  );
};

export default OutputPanel;
