import React, { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { Link, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Line} from "react-chartjs-2";
import '../styles.css';


const columnDefsData = [
    {headerName: "Date", field: "timestamp", flex: 1},
    {headerName: "Open", field: "open", flex: 1},
    {headerName: "High", field: "high", flex: 1},
    {headerName: "Low", field: "low", flex: 1},
    {headerName: "Close", field: "close", flex: 1},
    {headerName: "Volumes", field: "volumes", flex: 1},
  ];
  
export default function StockData() {
    const {symbol} = useParams();
    const [stocks, setStocks] = useState([]);
    const [name, setName] = useState("");
    const [fromSearch, setFromSearch] = useState("");
    const [toSearch, setToSearch] = useState("");
    const [message, setMessage] = useState("");

    //Call to the API which gets all of the stocks that match the query
    const mySubmitHandler = () => {
      const urlSearch = `http://131.181.190.87:3000/stocks/authed/${symbol}?from=${fromSearch}&to=${toSearch}`
      
      fetch(urlSearch, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setMessage("No stocks in that date range (displaying previous stock information)");
            if (fromSearch === "" || toSearch === "") {
              setMessage("Please fill in atleast one date entry (displaying previous stock information)");
            }
          }
          else {
            setStocks(res);
            setMessage("");
          }
        })
    }
    //Initial API call for stock info
    const url = `http://131.181.190.87:3000/stocks/${symbol}`;
    useEffect(() => {
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          setName(res.name);
          setStocks([res]);
        })
        // eslint-disable-next-line
    }, []);
    
    //Turning the timestamp into a date
    stocks.forEach (stock => 
      stock.timestamp = stock.timestamp.substr(0, 10)
    );
  
    return (
      <div id="stockDataContent">
        <h2>{symbol} - {name}</h2>
        <div id="searchByDate">
          {localStorage.getItem("isAuthenticated") === "true" ? (
          <form 
            onSubmit = {(event) => {
              event.preventDefault();
              mySubmitHandler();
            }} 
          >
            <input type="date"
              name="fromSearch"
              id="fromSearch"
              onChange={(event) => {
                setFromSearch(event.target.value);
              }}
            />
            <label htmlFor="toSearch">-</label>
            <input type="date"
              name="toSearch"
              id="toSearch"
              onChange={(event) => {
                setToSearch(event.target.value);
              }}
            />
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          ) : ( 
            <Link to="/login" id="unAuthenticated">Login to access stock history</Link>
          )}
        </div>
        <p>{message}</p>
        <div className="ag-theme-alpine-dark">
          <AgGridReact
              columnDefs={columnDefsData}
              rowData={stocks}
              pagination={true}
              paginationAutoPageSize={true}
          />
        </div>
        {stocks.length > 1 ? (
        <div id="chart">
          <Line
            data={{
              labels: stocks.map(stock => stock.timestamp),
              datasets:[{
                  label: "Closing Price",
                  data: stocks.map(stock => stock.close),
                  backgroundColor: ["rgba(0 ,255, 255, 0.4)"],
                  borderColor: ["rgba(255, 255, 255, 1)"],
                  lineTension: 0
                }]
            }}
            options={{
              title: {
                display: true,
                text: `Closing Price of ${name} from ${fromSearch} to ${toSearch}`,
                fontSize: 20,
                fontColor: 'white',
              },
              legend: {
                labels: {
                  fontColor: 'white',
                }
              },
              scales: {
                xAxes: [{
                  display: true,
                  ticks: {
                    fontColor: "white",
                  }, 
                  gridLines: {
                    color: "rgba(255, 255, 255, 0.4)"
                  },
                  scaleLabel: {
                    display: true,
                    fontColor: 'white',
                    labelString: 'Date'
                  }
                }],
                yAxes: [{
                  display: true,
                  ticks: {
                    fontColor: "white",
                  }, 
                  gridLines: {
                    color: "rgba(255, 255, 255, 0.4)"
                  },
                  scaleLabel: {
                    display: true,
                    fontColor: 'white',
                    labelString: 'Closing Price'
                  }
                }]
              }
            }}
          />
        </div>
        ) : ( 
          <div />
        )}
      </div>
    );
}