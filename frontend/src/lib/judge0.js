// This file will be updated to call the Cloudflare Worker endpoints
// For now, keeping a placeholder that will hit the worker

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'https://leetcode-cron.romeirofernandes.workers.dev';

const LANGUAGE_IDS = {
  'c': 50,
  'cpp': 54,
  'java': 62,
  'python': 71,
  'javascript': 63
};

export const submitCodeBatch = async (submissions) => {
  try {
    const response = await fetch(`${WORKER_URL}/judge0/submit-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        submissions: submissions.map(({ code, language, input }) => ({
          source_code: code,
          language_id: LANGUAGE_IDS[language],
          stdin: input || '',
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Batch submission result:', result);
    
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error('Error submitting batch:', error);
    throw error;
  }
};

export const getSubmissionBatchResult = async (tokens) => {
  try {
    const tokenString = tokens.join(',');
    const response = await fetch(`${WORKER_URL}/judge0/submissions?tokens=${tokenString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Batch result response:', result);
    
    return result.submissions || result;
  } catch (error) {
    console.error('Error getting batch results:', error);
    throw error;
  }
};

// Keep single submission functions for backward compatibility
export const submitCode = async (code, language, input = '') => {
  try {
    const response = await fetch(`${WORKER_URL}/judge0/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: LANGUAGE_IDS[language],
        stdin: input
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.token;
  } catch (error) {
    console.error('Error submitting code:', error);
    throw error;
  }
};

export const getSubmissionResult = async (token) => {
  try {
    const response = await fetch(`${WORKER_URL}/judge0/submission/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error('Error getting submission result:', error);
    throw error;
  }
};
