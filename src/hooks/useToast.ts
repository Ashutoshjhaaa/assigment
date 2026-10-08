import { useState, useCallback } from 'react';

export function useToast(durationMs = 2800) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, durationMs);
  }, [durationMs]);

  return {
    toastMessage,
    showToast,
  };
}
