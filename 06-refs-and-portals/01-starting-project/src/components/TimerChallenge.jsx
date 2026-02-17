/**
 * TimerChallenge Component
 * 
 * LEARNER NOTES:
 * =============
 * This component demonstrates practical use of REFS in React for:
 * 1. Managing timers (setInterval/clearInterval)
 * 2. Controlling child components imperatively (modal)
 * 3. Tracking values that don't trigger re-renders
 * 
 * TWO REFS EXPLAINED:
 * 
 * 1. timerRef - Stores the setInterval ID
 *    - We need to store the ID to clear it later with clearInterval()
 *    - Can't use state because it shouldn't trigger re-renders
 *    - Perfect use case for useRef
 * 
 * 2. resultModalRef - Reference to ResultModal child component
 *    - Created via forwardRef + useImperativeHandle in ResultModal.jsx
 *    - Allows us to call resultModalRef.current.open() and close()
 *    - Demonstrates parent-child imperative communication
 * 
 * DERIVED STATE:
 * - timerActive: Calculated from remainingTime to determine if timer is running
 * - timerExpired: Calculated from remainingTime to determine if time ran out
 * 
 * WHY NOT USE STATE FOR REFS?
 * - State causes component re-renders (expensive)
 * - Timer ID doesn't need to be displayed
 * - Refs persist across renders without causing updates
 */
import { useState, useRef } from 'react';
import ResultModal from './ResultModal';

export const TimerChallenge = ({ title, targetTime }) => {
    // STATE: Tracks remaining time in milliseconds (updates every 10ms when active)
    const [remainingTime, setRemainingTime] = useState(targetTime * 1000);

    // REF: Stores the interval ID so we can clear it later
    // useRef instead of state because we don't need to trigger re-renders
    const timerRef = useRef(null);

    // REF: Reference to the ResultModal child component
    // This lets us call modal methods imperatively via open() and close()
    const resultModalRef = useRef(null);

    // DERIVED STATE: Timer is active when time has started decreasing but hasn't expired
    const timerActive = remainingTime > 0 && remainingTime < targetTime * 1000;

    // DERIVED STATE: Timer expired when no time remains
    const timerExpired = remainingTime <= 0;

    const handleStartChallenge = () => {
        // Start interval that decrements remaining time every 10ms
        timerRef.current = setInterval(() => {
            setRemainingTime((prevRemainingTime) => {
                if (prevRemainingTime <= 0) {
                    // Time's up! Stop the interval and show result modal
                    clearInterval(timerRef.current);
                    resultModalRef.current?.open();
                    return 0;
                }
                return prevRemainingTime - 10;
            });

        }, 10);
    };

    function handleStopChallenge() {
        // Stop the running timer before it expires
        clearInterval(timerRef.current);

        // Open modal to show result (user stopped in time)
        resultModalRef.current?.open();
    }

    function handleReset() {
        // Reset remaining time to initial value for next attempt
        setRemainingTime(targetTime * 1000);
    }

    // Handle modal close - Reset the timer state
    function handleModalClose() {
        handleReset();
    }

    // Calculate remaining seconds for display (convert ms to seconds)
    const remainingSeconds = (remainingTime / 1000).toFixed(2);

    // Calculate time left in seconds for the modal display
    const timeLeftInSeconds = (remainingTime / 1000).toFixed(2);

    return (
        <>
            <ResultModal
                ref={resultModalRef}
                result={timerExpired ? 'lost' : 'won'}
                targetTime={targetTime}
                remainingTime={remainingTime}
                timeLeft={timeLeftInSeconds}
                onReset={handleReset}
                onClose={handleModalClose}
            />
            <section className="challenge">
                <h2>{title}</h2>
                {timerExpired && <p>You lost!</p>}
                <p className="challenge-time">{targetTime} second{targetTime > 1 ? 's' : ''}</p>
                <p>
                    <button onClick={timerActive ? handleStopChallenge : handleStartChallenge}>
                        {timerActive ? 'Stop' : 'Start'} Challenge
                    </button>
                </p>
                <p className={timerActive ? 'active' : undefined}>
                    {timerActive ? 'Time is running...' : 'Timer inactive'}
                </p>
            </section>
        </>
    );
}
