import React from 'react';

export function counterReducer(state, action) {
    if (action.type === 'INCREMENT') {
        return { count: state.count + 1 };
    }
    if (action.type === 'DECREMENT') {
        return { count: state.count - 1 };
    }
    if (action.type === 'RESET') {
        return { count: 0 };
    }
    return state;
}

function App() {
    // Initialize useReducer with reducer function and initial state
    const [state, dispatch] = React.useReducer(counterReducer, { count: 0 });

    return (
        <div id="app">
            <h1>The (Final?) Counter</h1>
            <p id="actions">
                <button onClick={() => dispatch({ type: 'INCREMENT' })}>
                    Increment
                </button>
                <button onClick={() => dispatch({ type: 'DECREMENT' })}>
                    Decrement
                </button>
                <button onClick={() => dispatch({ type: 'RESET' })}>
                    Reset
                </button>
            </p>
            <p id="counter">{state.count}</p>
        </div>
    );
}

export default App;