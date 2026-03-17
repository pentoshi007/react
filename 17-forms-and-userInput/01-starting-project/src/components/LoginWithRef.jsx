import { useRef, useState } from 'react';

export default function LoginWithRef() {
  const [formIsInvalid, setFormIsInvalid] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();

    const enteredEmail = emailRef.current?.value ?? '';
    const enteredPassword = passwordRef.current?.value ?? '';

    const emailIsValid = enteredEmail.includes('@');
    if (!emailIsValid) {
      setFormIsInvalid(true);
      return;
    }
    console.log('submitted', { email: enteredEmail, password: enteredPassword });
    setFormIsInvalid(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            ref={emailRef}
          />
          <p className="control-error">{formIsInvalid && 'Please enter a valid email address.'}</p>
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            ref={passwordRef}
          />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat" type="reset">
          Reset
        </button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}

