import './styles.css';
import React, {useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from './components/Home';
import CondomsPage from './components/Condoms';
import TestingPage from './components/Testing';
import CommonSTIsPage from './components/CommonSTIs';
import FAQsPage from './components/FAQs';
import TreatmentPage from './components/Treatment';
import DashboardPage from './components/Dashboard';
import LoginPage from './components/Login';
import EditUsers from './components/EditUsers';
import AUheader, { AUheaderBrand } from './pancake/react/header';
import AUmainNav, { AUmainNavContent } from './pancake/react/main-nav';
import AUfooter, { AUfooterNav, AUfooterEnd } from './pancake/react/footer';
import { ImPhone } from "react-icons/im";
import { ImInstagram } from "react-icons/im";
import { ImTwitter } from "react-icons/im";

//Lambda function for header
const HeaderNav = () => {
  const isLoggedIn = !(localStorage.getItem('token') == null);

  useEffect(() => {

    var xpath = "//a[text()='Logout']";
    var logout = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (!!logout) {
      logout.onclick = function() {
        localStorage.removeItem('token');
        localStorage.setItem('authentication', '');
      };
    }
  }, []);

  return (
    <div id="header">
      <AUheader dark className="AUheader">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <AUheaderBrand
                title="Sexual Health Portal QLD"
                link="#"
                brandImage="https://designsystem.gov.au/assets/img/header-logo-agov.png"
                brandImageAlt="Error loading image"
              />
            </div>
          </div>
        </div>
      </AUheader>
      <AUmainNav dark>
        <div className="row">
          <div className="container">
            <AUmainNavContent items={[
              {
                link: '/',
                text: 'Home',
              },
              {
                link: 'condoms',
                text: 'Condoms',
              },
              {
                link: 'testing',
                text: 'STI Testing',
              },
              {
                link: 'treatment',
                text: 'Treatment',
              },
              {
                link: 'common',
                text: 'Common STIs',
              },
              {
                link: 'faqs',
                text: 'FAQs',
              }
            ]} />
          </div>
          
          <div className="container-change">
            {
              isLoggedIn ? (
                <AUmainNavContent items={[
                  {
                    link: '/dashboard',
                    text: 'Dashboard',
                  },
                  {
                    link: '/',
                    text: 'Logout',
                  }
                ]} />
              ) : (
                <AUmainNavContent items={[
                  {
                    link: '/login',
                    text: 'Login',
                  }
                ]} />
              )
            }
          </div>
        </div>
      </AUmainNav>
    </div>
  )
}

//Lambda function for footer
const Footer = () => {
  return (
    <AUfooter dark className="AUfooter custom-body">
      <div className="container">
        <AUfooterNav>
        <div className="row">
          <div className="column left">
            <h1> Contact Us </h1>
            <ul>
              <li> <p> For general enquiries, feedback, complaints and compliments: </p> </li>
              <li> <ImPhone id="phone"/>&nbsp;13 QGOV (13 74 68) </li>
            </ul>
            <ul>
              <li> <p> For COVID-19 related enquiries: </p> </li>
              <li><ImPhone id="phone"/>&nbsp;134 COVID (13 42 68)</li>
            </ul>
            <ul>
              <li><ImInstagram id="instagram"/>&nbsp;/queenslandhealth</li>
              <li><ImTwitter id="twitter"/>&nbsp;@qldhealthnews</li>
            </ul>
          </div>
          <div className="column right">
          <h1>Website feedback</h1>
              <ul><p>We are always looking for ways to improve our website.</p></ul>
              <button class="au-btn au-btn--secondary au-btn--dark">
                Leave your feedback!
              </button>
          </div>
        </div>    
        </AUfooterNav>
        <div className="row">
          <div className="col-sm-12">
            <AUfooterEnd>
                <a href="https://www.qld.gov.au/help/accessibility" className="footerLink">Accessibility</a>
                <a href="https://metronorth.health.qld.gov.au/copyright" className="footerLink">Copyright</a>
                <a href="https://metronorth.health.qld.gov.au/disclaimer" className="footerLink">Disclaimer</a>
                <a href="https://smartjobs.qld.gov.au/jobtools/jncustomsearch.jobsearch?in_organid=14904" className="footerLink">Jobs in Queensland Government</a>
                <a href="https://www.health.qld.gov.au/global/privacy" className="footerLink">Privacy</a>
                <a href="https://metronorth.health.qld.gov.au/about-us/information-access-privacy/right-to-information" className="footerLink">Right to Information</a>
                <a href="https://www.qld.gov.au/help/languages" className="footerLink">Other Languages</a>
              <br></br>
              <small>&copy; The State of Queensland (Queensland Health) 1996-2021</small>
              <br></br>
              <a href="https://www.qld.gov.au/" className="footerLink"><small>Queensland Government</small></a>
            </AUfooterEnd>
          </div>
        </div>
      </div>
    </AUfooter>
  )
}

//App - this is loaded from index.js
export default function App() {
  return (
    <Router>
      <div className="App">
        <div id="mainContent">
          <HeaderNav />
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/testing">
              <TestingPage />
            </Route>
            <Route exact path="/treatment">
              <TreatmentPage />
            </Route>
            <Route exact path="/faqs">
              <FAQsPage />
            </Route>
            <Route exact path="/condoms">
              <CondomsPage />
            </Route>
            <Route exact path="/common">
              <CommonSTIsPage />
            </Route>
            <Route exact path="/dashboard">
              <DashboardPage />
            </Route>
            <Route exact path ="/login">
              <LoginPage />
            </Route>
            <Route exact path="/dashboard/users">
              <EditUsers />
            </Route>
          </Switch>
          <Footer />
        </div>
      </div>
    </Router>
  );
}