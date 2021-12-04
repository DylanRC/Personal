import React from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

export default function Home() {
  return (
    <div id="homeContent">
      <p>
        Welcome to Stock Analysis, the best place to find information on stocks. In order to see a list of
        current stocks (filtered by industry) click on 'Stocks'. On the stocks page you will have the option
        of selecting the specific stock option and inspecting it further. Note, you must be logged in in order
        to access a particular stock's history. You can login in by selecting 'login', on the navigation bar. 
        Alternatively, if you do not yet have an account, you can register by selecting 'register', on the navigation
        bar.   
      </p>
      <Link to="/stocks" id="getStarted">Get Started</Link>
    </div>
  );
}