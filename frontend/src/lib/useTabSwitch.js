import { useEffect } from 'react';

export const useTabSwitch = (onTabSwitch) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onTabSwitch();
      }
    };

    const handleBlur = () => {
      onTabSwitch();
    };

    const handleFocus = () => {
      // Optional: handle when user comes back
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [onTabSwitch]);
};
