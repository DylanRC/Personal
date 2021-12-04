import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';


//Both the login form and the register form share a very similar style
const LoginRegisterForm = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const history = useHistory();

    //POSTS either the login or register information
    const mySubmitHandler = (props) => {
      const url = "http://131.181.190.87:3000"
      
      //If it's a login form
      if (props.type === "login") {
        fetch(`${url}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setMessage(res.message);
            if (res.token != null) {
              localStorage.setItem("isAuthenticated", "true");
              localStorage.setItem("token", res.token);
              history.push("/");
            }
          })
      }
      
      //If its a register form
      else if (props.type === "register") {
        fetch(`${url}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setMessage(res.message);
            if (res.success) history.push("/login");
          })
      }
    }
  
    return (
      <div id="formContent">
        <form 
          onSubmit = {(event) => {
            event.preventDefault();
            mySubmitHandler(props);
          }}
        >
          <label htmlFor="email">Email</label>
          <input type="text"
            name="email"
            id="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <label htmlFor="password">Password</label>
          <input type="password"
            name="password"
            id="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <p>{message}</p>
      </div>
    );
}
  
export function Login() {
    return (
        <div>
        <h1 className="formTitle">Login</h1>
        <LoginRegisterForm type="login"/>
        <center>
            <Link to="/register" id="linkRegister">Haven't Got an Account?</Link>
        </center>
        </div>
    );
}

export function Register() {
    return (
        <div>
        <h1 className="formTitle">Register</h1>
        <LoginRegisterForm type="register"/>
        </div>
    )
}