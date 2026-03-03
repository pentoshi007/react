import { useEffect, useState } from 'react';

export default function ProgressBar({ timer, open, onTimeout }) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    if (!open) {
      return;
    }

    setRemainingTime(timer);

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 10) {
          return 0;
        }
        return prevTime - 10;
      });
    }, 10);

    const timeout = setTimeout(() => {
      onTimeout();
    }, timer);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open, onTimeout, timer]);

  return <progress value={remainingTime} max={timer} />;
}
