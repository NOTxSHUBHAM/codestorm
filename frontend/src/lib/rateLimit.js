import { useState, useCallback } from 'react';

export const useRateLimit = (maxAttempts = 10, timeWindow = 60000) => {
  const [attempts, setAttempts] = useState([]);

  const canExecute = useCallback(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter(time => now - time < timeWindow);
    return recentAttempts.length < maxAttempts;
  }, [attempts, maxAttempts, timeWindow]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    setAttempts(prev => [...prev.filter(time => now - time < timeWindow), now]);
  }, [timeWindow]);

  const getRemainingTime = useCallback(() => {
    if (attempts.length === 0) return 0;
    const oldestAttempt = Math.min(...attempts);
    const timeElapsed = Date.now() - oldestAttempt;
    return Math.max(0, timeWindow - timeElapsed);
  }, [attempts, timeWindow]);

  return { canExecute, recordAttempt, getRemainingTime };
};
