import { useInput } from '../hooks/useInput';

export default function StateLogin() {
  const email = useInput('');
  const password = useInput('');

  function handleSubmit(event) {
    event.preventDefault();
    console.log('subitted');
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
            onChange={email.handleInputChange}
            onBlur={email.handleInputBlur}
            value={email.value}
          />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={password.handleInputChange}
            onBlur={password.handleInputBlur}
            value={password.value}
          />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}

