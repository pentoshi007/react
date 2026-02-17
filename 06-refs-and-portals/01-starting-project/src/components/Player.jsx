import { useState, useRef } from 'react';

export default function Player() {
  const playerNameRef = useRef();
  // const [enteredPlayerName, setEnteredPlayerName] = useState('');
  const [submittedPlayerName, setSubmittedPlayerName] = useState('');

  // TODO: Replace with refs and portals implementation

  // Input handling code (commented out - will use refs instead)
  // function handleChange(event) {
  //   setEnteredPlayerName(event.target.value);
  // }
  // function handleSubmit(event) {
  //   event.preventDefault();
  //   setSubmittedPlayerName(enteredPlayerName);
  // }
  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedPlayerName(playerNameRef.current.value);
    playerNameRef.current.value = '';//not the best way to do it, but it's a way to clear the input field
  }

  return (
    <section id="player">
      <h2>Welcome {submittedPlayerName || 'unknown entity'/*in first render, the value is not yet set*/}</h2>
      <p>
        {/* Input handling with refs and portals to be implemented */}
        {/* <input type="text" value={enteredPlayerName} onChange={handleChange} /> */}
        {/* <button onClick={handleSubmit}>Set Name</button> */}
        <input type="text" ref={playerNameRef} />
        <button onClick={handleSubmit}>Set Name</button>
      </p>
    </section>
  );
}
