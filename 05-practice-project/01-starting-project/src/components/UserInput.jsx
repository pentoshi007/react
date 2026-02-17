import { useState } from "react";

// Alternative approach using refs:
// import { useRef } from "react";
//
// export default function UserInput() {
//     const initialInvestmentRef = useRef();
//     const annualInvestmentRef = useRef();
//     const expectedReturnRef = useRef();
//     const durationRef = useRef();
//
//     function handleSubmit(event) {
//         event.preventDefault();
//         const userInput = {
//             initialInvestment: initialInvestmentRef.current.value,
//             annualInvestment: annualInvestmentRef.current.value,
//             expectedReturn: expectedReturnRef.current.value,
//             duration: durationRef.current.value,
//         };
//         // Do something with userInput...
//     }
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <section id="user-input">
//                 <div className="input-group">
//                     <p>
//                         <label>Initial Investment</label>
//                         <input type="number" id="initial-investment" required ref={initialInvestmentRef} />
//                     </p>
//                     <p>
//                         <label>Annual Investment</label>
//                         <input type="number" id="annual-investment" required ref={annualInvestmentRef} />
//                     </p>
//                 </div>
//                 <div className="input-group">
//                     <p>
//                         <label>Expected Return</label>
//                         <input type="number" id="expected-return" required ref={expectedReturnRef} />
//                     </p>
//                     <p>
//                         <label>Duration</label>
//                         <input type="number" id="duration" required ref={durationRef} />
//                     </p>
//                 </div>
//                 <button type="submit">Calculate</button>
//             </section>
//         </form>
//     );
// }
//
// Note: Using refs is useful when you only need the values on form submission
// and don't need to track changes in real-time. The useState approach (below)
// is better when you need controlled inputs with real-time validation or
// when you need to reflect input changes immediately in the UI.


export default function UserInput({ userInput, onChange }) {




    return (
        <section id="user-input">
            <div className="input-group">
                <p>
                    <label>Initial Investment</label>
                    <input type="number" id="initial-investment" required onChange={(event) => onChange('initialInvestment', event.target.value)} value={userInput?.initialInvestment} />
                </p>
                <p>
                    <label>Annual Investment</label>
                    <input type="number" id="annual-investment" required onChange={(event) => onChange('annualInvestment', event.target.value)} value={userInput?.annualInvestment} />
                </p>

            </div>
            <div className="input-group">
                <p>
                    <label>Expected Return</label>
                    <input type="number" id="expected-return" required onChange={(event) => onChange('expectedReturn', event.target.value)} value={userInput?.expectedReturn} />
                </p>
                <p>
                    <label>Duration</label>
                    <input type="number" id="duration" required onChange={(event) => onChange('duration', event.target.value)} value={userInput.duration} />
                </p>

            </div>
        </section>
    );
}