import { useState } from 'react';
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  function handleSubmit(event) {
    event.preventDefault();
    console.log("subitted");
  }
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          {/*htmlFor is used to link the label to the input in jsx, and for in pure html*/}
          <input id="email" type="email" name="email" onChange={handleChange} value={formData.email} />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" onChange={handleChange} value={formData.password} />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button
          // onClick={handleSubmit} 
          className="button">Login</button>
        {/*here the default type is submit, so the form will be submitted, we will have to change it to type="button"*/}

      </p>
    </form>
  );
}
