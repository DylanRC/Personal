import React, {useState} from 'react'
import { AUlabel, AUformGroup } from '../pancake/react/form';
import AUtextInput from '../pancake/react/text-inputs';
import AUbutton from '../pancake/react/buttons';

//Toggles between the Login and Registration Page
function toggle(value) {
  if (value) {
    document.getElementById('toggleValue').innerHTML = "Already have an account?";
  }
  else {
    document.getElementById('toggleValue').innerHTML = "Don't have an account?";
  }
  document.getElementById('email').value = "";
  document.getElementById('password').value = "";

  return (value = !value);
}

//Contains the login and register functions responsible backend server calls
function LoginOrRegister(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  function Login(email, password) {
    // Form a JSON request
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    };

    // Send the API request accordingly
    fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/users/login", requestOptions)
    .then(res => res.json())
    .then((res) => {
      if (res.error) {
        alert(res.message);
      }
      else {
        localStorage.setItem('token', res.token);

        if (res.admin === 1) {
          localStorage.setItem('authentication', 'admin');
        } else {
          localStorage.setItem('authentication', 'user');
        }
        localStorage.setItem('name', res.fullName);
        window.location.href = '/';
      }
    });
  }

  function Register(email, password, fullName) {
    // Form a JSON request
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, fullName: fullName })
    };

    // Send the API request accordingly
    fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/users/register", requestOptions)
    .then(res => res.json())
    .then((res) => {
      if (res.error) {
        alert(res.message);
      }
      else {
        Login(email, password);
      }
    });
  }

  if (props.loginOrRegister) {
    return (
      <div id="formContent">
        <div className="au-body main-content custom-style form-body">
          <div className="au-body">
            <div id="main-div">
              <AUformGroup className="center-login">
                <h2><bold> Login </bold></h2>
                <br />
                <div className="form">
                  <div id="login-break">
                    <AUlabel htmlFor="email" text="Email" />
                    <AUtextInput type="email" name="email" id="email"
                      onChange={(e) => { setEmail(e.target.value); }} />
                  </div>
                  <AUlabel htmlFor="password" text="Password" />
                  <AUtextInput type="password" name="password" id="password"  
                    onChange={(e) => { setPassword(e.target.value); }} />              
                </div>
                <br />
                <br />
                <AUbutton class="au-btn button-width" type='submit'
                  onClick={(e) => {
                    e.preventDefault();
                    Login(email, password);
                  }}> 
                  Login                 
                </AUbutton> 
              </AUformGroup>
            </div>
          </div>          
        </div>
      </div>
    );
  }

  else {
    return (
      <div id="formContent">
        <div className="au-body main-content custom-style form-body">
          <AUformGroup className="center-login">
            <h2><bold> Register an account </bold></h2>
            <br />
            <div className="form">
              <div id="login-break">
                <AUlabel htmlFor="email" text="Enter your email" />
                <AUtextInput type="email" name="email" id="email"
                  onChange={(e) => { setEmail(e.target.value); }} />
              </div>
              <div id="login-break">
                <AUlabel htmlFor="password" text="Create a password" />
                <AUtextInput type="password" name="password" id="password"
                  onChange={(e) => { setPassword(e.target.value); }} />
              </div> 
              <div id="login-break">
                <AUlabel htmlFor="password" text="Confirm your password" />
                <AUtextInput type="password" id="password" />
              </div>
              <AUlabel htmlFor="fullName" text="Enter your full name" />
              <AUtextInput type="fullName" name="fullName" id="fullName"
                onChange={(e) => { setFullName(e.target.value); }} />
            </div>
            <br />
            <br />
            <AUbutton class="au-btn button-width" type='submit'
              onClick={(e) => {
                e.preventDefault();
                Register(email, password, fullName);
              }}> 
              Register            
            </AUbutton> 
          </AUformGroup>
        </div>
      </div> 
    );
  }
}

//Master function for displaying the login or register pages
export default function UserLoginOrRegister() {
  const [loginView, setLoginView] = useState(1);
  return (
    <div>
      <AUformGroup>
        <LoginOrRegister loginOrRegister={loginView} />
          <center>
            <a href="#" class="au-btn au-btn--tertiary toggle-body"
              onClick={() => { setLoginView(toggle(loginView)); }}>
              <a id='toggleValue'> Don't have an account? </a>
            </a>
          </center>            
      </AUformGroup>
      <br />
    </div>
  );
}
