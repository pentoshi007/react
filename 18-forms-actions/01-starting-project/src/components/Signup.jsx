import { useState } from 'react';
import { isEmail, isNotEmpty, hasMinLength, isEqualToOtherValue } from '../util/validation';

function signUpAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");
  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");
  const role = formData.get("role");
  const acquisition = formData.getAll("acquisition");
  const terms = formData.get("terms");
  console.log(email, password, confirmPassword, firstName, lastName, role, acquisition, terms);

  let errors = [];
  if (!isEmail(email)) {
    errors.push("Invalid email");
  }
  if (!isNotEmpty(password) || !hasMinLength(password, 6)) {
    errors.push("Password is required and must be at least 6 characters long");
  }
  if (!isEqualToOtherValue(password, confirmPassword)) {
    errors.push("Passwords do not match");
  }
  if (!isNotEmpty(firstName)) {
    errors.push("First name is required");
  }
  if (!isNotEmpty(lastName)) {
    errors.push("Last name is required");
  }
  if (!isNotEmpty(role)) {
    errors.push("Role is required");
  }
  // Optionally, check for terms/agreement:
  if (!terms) {
    errors.push("You must agree to the terms and conditions");
  }
  if (acquisition.length === 0) {
    errors.push("You must select at least one acquisition channel");
  }
  // You would handle errors here (e.g., by returning or showing messages)
  // This form action only logs, for demo purposes

  // If you want to return errors as part of form actions, you typically throw or return a value here
  if (errors.length > 0) {
    return { errors: errors, enteredValues: { email, password, confirmPassword, firstName, lastName, role, acquisition, terms } };
  }
  return { errors: null };
}
import { useActionState } from 'react';

// Reset: native <button type="reset"> only restores DOM fields; it does not run the form action or
// update useActionState, so validation errors (and enteredValues) would stay visible. Bumping
// formKey remounts SignupForm so useActionState resets to its initial state and uncontrolled
// inputs get fresh defaultValues again.
export default function Signup() {
  const [formKey, setFormKey] = useState(0);
  return <SignupForm key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function SignupForm({ onReset }) {
  const [state, formAction] = useActionState(signUpAction, { errors: null });

  return (
    <form action={formAction}>
      <h2>Welcome on board!</h2>
      <p>We just need a little bit of data from you to get you started 🚀</p>

      <div className="control">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" defaultValue={state.enteredValues?.email} />
      </div>

      <div className="control-row">
        <div className="control">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" defaultValue={state.enteredValues?.password} />
        </div>

        <div className="control">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            name="confirm-password"
            defaultValue={state.enteredValues?.confirmPassword}
          />
        </div>
      </div>

      <hr />

      <div className="control-row">
        <div className="control">
          <label htmlFor="first-name">First Name</label>
          <input type="text" id="first-name" name="first-name" defaultValue={state.enteredValues?.firstName} />
        </div>

        <div className="control">
          <label htmlFor="last-name">Last Name</label>
          <input type="text" id="last-name" name="last-name" defaultValue={state.enteredValues?.lastName} />
        </div>
      </div>

      <div className="control">
        <label htmlFor="role">What best describes your role?</label>
        <select id="role" name="role" defaultValue={state.enteredValues?.role}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="employee">Employee</option>
          <option value="founder">Founder</option>
          <option value="other">Other</option>
        </select>
      </div>

      <fieldset>
        <legend>How did you find us?</legend>
        <div className="control">
          <input
            type="checkbox"
            id="google"
            name="acquisition"
            value="google"
            defaultChecked={state.enteredValues?.acquisition?.includes("google")}
          />
          <label htmlFor="google">Google</label>
        </div>

        <div className="control">
          <input
            type="checkbox"
            id="friend"
            name="acquisition"
            value="friend"
            defaultChecked={state.enteredValues?.acquisition?.includes("friend")}
          />
          <label htmlFor="friend">Referred by friend</label>
        </div>

        <div className="control">
          <input type="checkbox" id="other" name="acquisition" value="other" defaultChecked={state.enteredValues?.acquisition?.includes("other")} />
          <label htmlFor="other">Other</label>
        </div>
      </fieldset>

      <div className="control">
        <label htmlFor="terms-and-conditions">
          <input type="checkbox" id="terms-and-conditions" name="terms" defaultChecked={state.enteredValues?.terms} />I
          agree to the terms and conditions
        </label>
      </div>

      {
        state.errors && <ul className="error">
          {state.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      }
      <p className="form-actions">
        {/* type="button" so we only trigger onReset (key bump); type="reset" would not clear React state */}
        <button type="button" className="button button-flat" onClick={onReset}>
          Reset
        </button>
        <button className="button">Sign up</button>
      </p>
    </form>
  );
}
