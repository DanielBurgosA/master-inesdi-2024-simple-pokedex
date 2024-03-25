import { useState, useEffect, useCallback } from "react";

let timeout: number = 0;

export function useTextTransition(duration = 50) {
  const [ready, setReady] = useState(false);

  const resetTransition = useCallback(() => {
    timeout && window.clearTimeout(timeout);
    setReady(false);
  }, []);

  useEffect(() => {
    if (ready) {
      return;
    }

    timeout = window.setTimeout(() => {
      setReady(true);
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [duration, ready]);

  return { ready, resetTransition };
}
