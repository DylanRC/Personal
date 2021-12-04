import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Home from './components/Home';
import { Login, Register } from './components/LoginRegister';
import Stocks from './components/Stocks';
import StockData from './components/StockData';


localStorage.setItem("token", "0.0.0");
localStorage.setItem("isAuthenticated", "false");

const Navbar = () => {
    const history = useHistory();
  
    const handleClick = () => {
      localStorage.isAuthenticated = "false";
      localStorage.token = "0.0.0"
      history.push("/");
    }
  
    return (
      <div id="navBar">
        <div id="navPages">
          <Link to="/" className="navContent">Home</Link>
          <Link to="/stocks" className="navContent">Stocks</Link>
        </div>
        <div id="title">
          <p>Stock Analysis</p>
        </div>
        {localStorage.getItem("isAuthenticated") === "true" ? (
          <div id="navAuthentication">
            <div className="navContent" id="logout" onClick={handleClick}>
              Logout
            </div>
          </div>
        ) : (
          <div id="navAuthentication">
            <Link to="/login" className="navContent">Login</Link>
            <Link to ="/register" className="navContent">Register</Link>
          </div>
        )}
      </div>
    );
}


export default function App() {
    return (
      <Router>
        <div className="App">
          <div id="mainContent">
            <Switch>
              <Route exact path="/">
                <Navbar />
                <Home />
              </Route>
              <Route exact path="/stocks">
                <Navbar />
                <Stocks />
              </Route>
              <Route exact path="/login">
                <Navbar />
                <Login />
              </Route>
              <Route exact path="/register">
                <Navbar />
                <Register />
              </Route>
              <Route path="/stocks/:symbol">
                <Navbar />
                <StockData />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
}