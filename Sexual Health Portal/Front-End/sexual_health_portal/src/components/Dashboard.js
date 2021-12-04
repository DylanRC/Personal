import React, { useState, useEffect } from 'react';
import Modal from './Modal'
import AUcard, { AUcardInner, AUcardTitle, AUcardLink } from '../pancake/react/card';
import { AUcallout } from '../pancake/react/callout';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { FaFolderOpen, FaRegCalendarAlt, FaClinicMedical, FaInfoCircle } from "react-icons/fa"
import { GoCheck } from "react-icons/go"
import { ImCross } from "react-icons/im"
import AUbutton from '../pancake/react/buttons';


//When a row is clicked open the model and add event listeners
function triage(id) {
    document.getElementById('openModal3').click();

    var confirm = document.getElementById("triageConfirm");
    var deny = document.getElementById("triageDeny");

    confirm.onclick = function() {serverCall("confirmed", id)};
    deny.onclick = function() {serverCall("rejected", id)};   
}

//Calls the backend API to triage appointments
function serverCall(status, id) {
  // Form a JSON request
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id, status: status })
  };

  //Call the server
  fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/appointments/triage", requestOptions)
  .then(res => res.json())
  .then((res) => {
    console.log(res);
    window.location.reload()
  });
}


//Dashboard Page
export default function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [results, setResults] = useState([]);
    const [datetime, setDatetime] = useState("");
    const [doctor, setDoctor] = useState("");

    //Lambda function to request an appointment
    const requestAppointment = () => {
      // Form a JSON request
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ datetime: datetime, doctor: doctor })
      };

      // Send the API request accordingly
      fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/appointments/request", requestOptions)
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        window.location.reload();
      });
    }

    const resultsDefs = [
        {headerName: "Row", valueGetter: "node.rowIndex + 1"},
        {headerName: "Result", field: "result", flex: 1}
    ];
    const columnDefs = [
        {headerName: "Datetime", field: "datetime", flex: 1},
        {headerName: "Doctor", field: "doctor", flex: 1},
        {headerName: "Clinic", field: "clinic_id", flex: 1}
    ];

    var name = localStorage.getItem("name");

    //API call for appointments
    useEffect(() => {
      // Form a JSON request
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          'Content-Type': 'application/json'
        }
      };

      // Send the API request accordingly
      fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/appointments/get", requestOptions)
      .then(res => res.json())
      .then((res) => setAppointments(res))

      fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/data/results", requestOptions)
      .then(res => res.json())
      .then((res) => setResults(res))
    }, []);

    function toggleResults() {
      var resultsCover = document.getElementById("resultsCover");
      resultsCover.style.display = "none";
      var resultsContent = document.getElementById("resultsContent");
      resultsContent.style.display = "block";
    }

    //User dashboard
    if (localStorage.getItem("authentication") === "user") {
        return (
            <div id="dashboardContent">
                <div className="au-body custom-body">
                    <AUcallout title={`Welcome ${name}`} className="welcome" />
                    <div className="results" onClick={toggleResults}>                     
                        <p id="resultsCover">Click to see test results!</p>
                        <div className="ag-theme-alpine-dark" id="resultsContent" style={{display: "none"}}>
                          <AgGridReact  
                            columnDefs={resultsDefs}
                            rowData={results}
                            pagination={true}
                            paginationAutoPageSize={true}
                          />
                        </div>
                    </div>                    
                    <div className="equidistance">
                        <div id="openModal1" className="quarterSplit">
                            <AUcard className="au-body custom-card dashboard-card" shadow style={{ borderTop: "solid red 5px", cursor: "pointer"}}>
                                <FaFolderOpen id="book"/>
                                <AUcardInner>
                                <AUcardTitle level="3">Book Appointment</AUcardTitle>
                                </AUcardInner>
                            </AUcard>
                        </div>                        
                        <Modal id="1" content={
                          <div>
                            <h2 className="bookingsHeader"> Book Appointment </h2>
                            <form
                              onSubmit = {(event) => {
                                event.preventDefault();
                                requestAppointment();
                              }}>
                              <label htmlFor="datetime">Datetime </label>
                              <input type="datetime-local"
                                name="datetime"
                                id="datetime"
                                value={datetime}
                                onChange={(event) => {
                                setDatetime(event.target.value);
                                }}
                              />
                              <label htmlFor="doctor">Doctor </label>
                              <input type="text"
                                name="doctor"
                                id="doctor"
                                value={doctor}
                                onChange={(event) => {
                                setDoctor(event.target.value);
                                }}
                              />
                              <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                          </div>
                        } />
                        <div id="openModal2" className="quarterSplit">
                            <AUcard className="au-body custom-card dashboard-card" shadow style={{borderTop: "solid orange 5px", cursor: "pointer"}}>
                                <FaRegCalendarAlt id="calender"/>
                                <AUcardInner>
                                <AUcardTitle level="3">Appointment Times</AUcardTitle>
                                </AUcardInner>
                            </AUcard>
                        </div>
                        <Modal id="2" content={
                          <div>
                            <h2 className="appointmentsHeader"> Appointment Times </h2>
                            <div className="ag-theme-alpine-dark" id="appointmentsTable">
                              <AgGridReact
                                columnDefs={columnDefs}
                                rowData={appointments}
                                pagination={true}
                                paginationAutoPageSize={true}
                              />
                            </div>
                          </div>
                        } />
                        <div className="quarterSplit">
                            <AUcard className="au-body custom-card dashboard-card" clickable shadow style={{borderTop: "solid purple 5px"}}>
                                <FaClinicMedical id="clinic"/>
                                <AUcardInner>
                                <AUcardTitle level="3">Clinic Locations<AUcardLink link="https://www.google.com.au/maps/search/sexual+health+clinics/@-27.3360803,152.3088521,9z"/></AUcardTitle>
                                </AUcardInner>
                            </AUcard>
                        </div>
                        <div className="quarterSplit">
                            <AUcard className="au-body custom-card dashboard-card" clickable shadow style={{borderTop: "solid blue 5px"}}>
                                <FaInfoCircle id="information"/>
                                <AUcardInner>
                                <AUcardTitle level="3">Sexual Health Information<AUcardLink link="https://www.qld.gov.au/health/staying-healthy/sexual-health"/></AUcardTitle>
                                </AUcardInner>
                            </AUcard>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    //Administrator dashboard
    else {
        //Define columns for appointments table
        const columnDefs = [
            {headerName: "ID", field: "id", flex: 1},
            {headerName: "User", field: "user_id", flex: 1},
            {headerName: "Datetime", field: "datetime", flex: 1},
            {headerName: "Doctor", field: "doctor", flex: 1},
            {headerName: "Clinic", field: "clinic_id", flex: 1}
        ];

        return (
            <div id="dashboardContent">
                <div className="au-body custom-body">
                    <AUcallout title={`Welcome ${name}`} className="welcome" />
                    <div className="ag-theme-alpine-dark">
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={appointments}
                            pagination={true}
                            paginationAutoPageSize={true}
                            onRowClicked={row => triage(row.data.id)}
                        />
                    </div>
                    <div id="openModal3" style={{display: "none"}}/>
                    <Modal id="3" content={
                        <div className="triage"> 
                            <div id="triageConfirm" className="halfSplit confirm"> 
                                <center> <GoCheck id="testID" className="triageIcon" style={{ paddingTop: "20px"}} /> </center>
                            </div>
                            <div id="triageDeny" className="halfSplit deny"> 
                                <center> <ImCross className="triageIcon" style={{ paddingTop: "30px"}} /> </center>
                            </div>
                        </div>
                    } />
              <br></ br>
              <AUbutton class="au-btn button editUsersButton"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/dashboard/users'
                }}>
                Edit Users
              </AUbutton>
           
              </div>
            
            </div>
        )
    }
}