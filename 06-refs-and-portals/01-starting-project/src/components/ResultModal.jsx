import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * ResultModal Component
 * 
 * LEARNER NOTES:
 * ============
 * This component demonstrates the use of REFS and IMPERATIVE HANDLE in React.
 * 
 * 1. forwardRef():
 *    - Functional components don't receive refs by default
 *    - forwardRef() allows us to forward the ref to a child DOM element
 *    - Without forwardRef, passing ref to a functional component would be ignored
 * 
 * 2. useRef():
 *    - Creates a mutable object that persists across re-renders
 *    - Doesn't cause component re-render when updated (unlike setState)
 *    - Perfect for direct DOM manipulation
 * 
 * 3. useImperativeHandle():
 *    - Customizes the value exposed when a ref is accessed from parent
 *    - Instead of exposing the raw DOM element, we expose custom methods
 *    - This creates a cleaner API: parent calls ref.current.open() instead of ref.current.showModal()
 *    - Encapsulates implementation details - parent doesn't need to know about dialogRef
 * 
 * WHY USE THIS PATTERN?
 * - Gives parent components imperative control over modal
 * - Better than prop drilling with isOpen state
 * - Dialog element's showModal() and close() methods aren't state-based
 * - Combines best of both: React's declarative style + imperative DOM control
 */

const ResultModal = forwardRef(function ResultModal({ result, targetTime, remainingTime, timeLeft, onReset, onClose }, ref) {
    // Internal ref to the actual <dialog> DOM element
    const dialogRef = useRef(null);

    /**
     * SCORE CALCULATION EXPLAINED:
     * ===========================
     * Score represents how well the user performed
     * 
     * 1. elapsedTime = Time they let pass before stopping
     * 2. elapsedPercent = What percentage of target time they used (0-100%)
     * 3. score = How much closer to target they got
     *    - If they stopped at target time: score = 100%
     *    - If they stopped with 50% time left: score = 50%
     *    - If time expired: score = 0%
     */
    
    // Calculate how much time was used (elapsed)
    const targetTimeMs = targetTime * 1000;
    const elapsedTime = targetTimeMs - remainingTime;
    
    // Calculate score as a percentage (how close they got to the target time)
    // Score = (elapsedTime / targetTime) * 100
    const scorePercentage = Math.round((elapsedTime / targetTimeMs) * 100);
    
    // Determine performance rating based on score
    let performanceRating = '';
    let performanceClass = '';
    
    if (result === 'lost') {
        // Timer expired - they failed
        performanceRating = '💀 GAME OVER';
        performanceClass = 'result-lost';
    } else {
        // They stopped manually - calculate performance
        if (scorePercentage >= 90) {
            performanceRating = '⭐ PERFECT!';
            performanceClass = 'result-perfect';
        } else if (scorePercentage >= 75) {
            performanceRating = '✨ EXCELLENT';
            performanceClass = 'result-excellent';
        } else if (scorePercentage >= 50) {
            performanceRating = '👍 GOOD';
            performanceClass = 'result-good';
        } else {
            performanceRating = '😅 OK';
            performanceClass = 'result-ok';
        }
    }

    // useImperativeHandle exposes custom methods to the parent component
    // Parent accesses these through: resultModalRef.current.open() or resultModalRef.current.close()
    useImperativeHandle(ref, () => ({
        /**
         * open() - Opens the modal dialog
         * This is the method parent component will call
         * We named it 'open' for simplicity instead of 'showModal'
         */
        open() {
            // Optional chaining (?.) - only calls if dialogRef.current exists
            dialogRef.current?.showModal();
        },

        /**
         * close() - Closes the modal dialog
         * Parent can also close it via this ref method
         */
        close() {
            dialogRef.current?.close();
        }
    }));

    const handleCloseModal = () => {
        // Call the onClose callback when modal is closed
        if (onClose) {
            onClose();
        }
    };

    /**
     * PORTAL EXPLANATION:
     * ==================
     * 
     * Why use createPortal()?
     * 
     * 1. SEMANTIC HTML:
     *    - Dialog is a semantic element that shouldn't be deeply nested in component trees
     *    - Portals render the dialog at the document root level (outside parent component)
     *    - This keeps HTML structure clean and semantic
     * 
     * 2. CSS Z-INDEX MANAGEMENT:
     *    - Without portal: Dialog inherits stacking context from parent
     *    - With portal: Dialog renders at top level, avoiding z-index conflicts
     *    - Ensures dialog always appears above other content
     * 
     * 3. EVENT HANDLING:
     *    - Portals receive events that bubble up from their portal container
     *    - Dialog backdrop click events work correctly even when portaled
     *    - Keyboard events (ESC key) handled properly
     * 
     * 4. ACCESSIBILITY:
     *    - Screen readers better understand modal structure at root level
     *    - Improves semantics for assistive technologies
     * 
     * 5. VISUAL LAYERING:
     *    - Dialog can render a full-screen backdrop without overflow issues
     *    - Backdrop doesn't inherit overflow: hidden from parent containers
     *    - Prevents layout shifting issues
     * 
     * Where does it render?
     * - First argument: The JSX/component to render
     * - Second argument: The target DOM node (typically document.getElementById('modal-root'))
     *                   Must exist in index.html: <div id="modal-root"></div>
     */

    const dialogElement = (
        <dialog className="result-modal" ref={dialogRef} onClose={handleCloseModal}>
            <h2>{performanceRating}</h2>
            <p>The target time was <strong>{targetTime} seconds</strong></p>
            <p>You stopped the timer with <strong>{timeLeft || 0} seconds</strong> left</p>
            
            {/* Score Display */}
            <div className="score-section">
                <p className="score-label">Your Score:</p>
                <div className={`score-bar ${performanceClass}`}>
                    <div className="score-fill" style={{ width: `${scorePercentage}%` }}>
                        <span className="score-text">{scorePercentage}%</span>
                    </div>
                </div>
                <p className="score-details">
                    {result === 'lost' 
                        ? `⏱️ Time ran out! You needed to stop before ${targetTime}s` 
                        : `✅ You stopped at ${((elapsedTime / 1000).toFixed(2))}s of ${targetTime}s`
                    }
                </p>
            </div>
            
            <form method="dialog">
                <button>Close</button>
            </form>
        </dialog>
    );

    // Render dialog using portal into the 'modal-root' div in index.html
    // This keeps the dialog outside the normal component tree hierarchy
    return createPortal(
        dialogElement,
        document.getElementById('modal-root')
    );
})

export default ResultModal
