import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTestTimer
 * High-accuracy countdown timer for test examinations.
 * Uses target end timestamp to prevent drift and survive tab throttling.
 */
export function useTestTimer({
  totalSeconds,
  initialRemainingSeconds,
  targetEndTime,
  isRunning = false,
  onTimeUp,
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    if (typeof initialRemainingSeconds === 'number' && initialRemainingSeconds >= 0) {
      return initialRemainingSeconds;
    }
    return totalSeconds;
  });

  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const hasTriggeredRef = useRef(false);

  // Sync remaining seconds if initial values reset
  useEffect(() => {
    if (!isRunning && initialRemainingSeconds !== undefined) {
      setSecondsRemaining(initialRemainingSeconds);
    }
  }, [isRunning, initialRemainingSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    // Reset triggered flag when starting
    hasTriggeredRef.current = false;

    const tick = () => {
      let remaining;
      if (targetEndTime) {
        const now = Date.now();
        remaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      } else {
        setSecondsRemaining((prev) => {
          const next = Math.max(0, prev - 1);
          if (next === 0 && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            if (onTimeUpRef.current) onTimeUpRef.current();
          }
          return next;
        });
        return;
      }

      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          if (onTimeUpRef.current) onTimeUpRef.current();
        }
      }
    };

    // Run tick immediately to sync
    tick();

    const intervalId = setInterval(tick, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, targetEndTime]);

  const isLowTime = secondsRemaining <= 60 && secondsRemaining > 0;
  const isTimeUp = secondsRemaining === 0;

  const formatTime = useCallback((secs) => {
    const s = Math.max(0, Math.floor(secs));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }, []);

  return {
    secondsRemaining,
    setSecondsRemaining,
    isLowTime,
    isTimeUp,
    formattedTime: formatTime(secondsRemaining),
    formatTime,
  };
}
