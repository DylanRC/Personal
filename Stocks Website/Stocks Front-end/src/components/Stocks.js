import React, { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';


const columnDefs = [
    {headerName: "Name", field: "name", flex: 1},
    {headerName: "Symbol", field: "symbol", flex: 1},
    {headerName: "Industry", field: "industry", flex: 1}
];
  
export default function Stocks() {
    const [search, setSearch] = useState("")
    const [stocks, setStocks] = useState([]);
    const history = useHistory();
    const industries = [
      "Health Care", "Industrials", "Consumer Discretionary", 
      "Information Technology", "Consumer Staples", "Utilities", "Financials",
      "Real Estate", "Materials", "Energy", "Telecommunication Services"
    ];
    const stockResults = [];
    
    //API call for all stocks
    useEffect(() => {
      const url = "http://131.181.190.87:3000/stocks/symbols";
      fetch(url)
        .then((res) => res.json())
        .then((res) => setStocks(res))
    }, []);
  
    //Client-Side search by industry, name(#) and symbol($)
    for (var stock in stocks) {
      if (search.startsWith("$")) {
        if (stocks[stock].symbol.includes(search.substr(1))) {
          stockResults.push(stocks[stock]);
        }
      }
      else if (search.startsWith("#")) {
        if (stocks[stock].name.includes(search.substr(1))) {
          stockResults.push(stocks[stock]);
        }
      }
      else {
        if (stocks[stock].industry.includes(search) || search === "All Industries") {
          stockResults.push(stocks[stock]);
        }
      }
    }
  
    return (
      <div id="stocksContent">
        <div id="searchElements">
          <input type="text"
            name="search"
            id="search"
            placeholder="Search ($, #)"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <select id="searchTerm"
            className="custom-select"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          >
            <option>All Industries</option>
            {industries.map((industry) => {
              return (
                <option>{industry}</option>
              )
            })}
          </select>
        </div>
        <div className="ag-theme-alpine-dark" id="table">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={stockResults}
            pagination={true}
            paginationAutoPageSize={true}
            onRowClicked={row => history.push(`/stocks/${row.data.symbol}`)}
          />
        </div>
      </div>
    )
}