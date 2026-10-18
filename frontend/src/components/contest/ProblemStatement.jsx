import React from 'react';

const ProblemStatement = ({ problem, isSE = false }) => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">{problem.title}</h2>
        {isSE && problem.type === 'solving' && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm rounded-full">
            ★ Higher Marks
          </span>
        )}
      </div>
      
      <div className="prose prose-sm max-w-none text-foreground">
        <p className="mb-6 text-muted-foreground leading-relaxed">
          {problem.description}
        </p>
        
        {problem.examples && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-lg">Examples:</h4>
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg mb-3 border">
                <div className="mb-3">
                  <strong className="text-foreground">Input:</strong>
                  <pre className="bg-card p-3 rounded-md mt-2 text-sm border font-mono overflow-x-auto">
                    {example.input}
                  </pre>
                </div>
                <div>
                  <strong className="text-foreground">Output:</strong>
                  <pre className="bg-card p-3 rounded-md mt-2 text-sm border font-mono overflow-x-auto">
                    {example.output}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {problem.constraints && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-lg">Constraints:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {problem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatement;
