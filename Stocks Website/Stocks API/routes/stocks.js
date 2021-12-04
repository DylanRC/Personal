var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();


//Get all stocks with optional industry search
router.get('/symbols', function (req, res, next) {

  if (Object.keys(req.query).length > 0 && !req.query.industry) {
    res.status(400).json({ error: true, message: "Invalid query parameter: only 'industry' is permitted" })
    return;
  }

  req.db
    .from('stocks')
    .distinct("name", "symbol", "industry")
    .modify((qb) => {
      if (req.query.industry) qb.where("industry", "LIKE", "%" + req.query.industry + "%")
    })
    .then((rows) => {
      if (rows.length == 0) {
        res.status(404).json({"error" : true, "message" : "Industry sector not found"});
        return;
      }

      res.status(200).json(rows)
    })
    .catch((err) => {
      console.log(err);
      res.json({ "error" : true, "message" : "Error in MySQL query" })
    })
});


//Getting stocks by symbol
router.get('/:symbol?', function(req, res) {
  if (!req.params.symbol) {
    res.json({ "error" : true, 
    "message" : "Request on /stocks must include symbol as path parameter,\
 or alteratively you can hit /stocks/symbols to get all stock options" })
    return;
  }

  if (req.params.symbol.length > 5 || req.params.symbol !== req.params.symbol.toUpperCase()) {
    res.json({ "error" : true, "message" : "Stock symbol incorrect format - must be 1-5 capital letters"});
    return;
  }

  req.db
    .from('stocks')
    .distinct("*")
    .where("symbol", "=", req.params.symbol)
    .orderBy("timestamp", "desc")
    .first()
    .then((row) => {
      if (!row) {
        res.status(404).json({ "error" : true, "message" : "No entry for symbol in stocks database" });
        return;
      }

      if (Object.keys(req.query).length > 0 && (req.query.to || req.query.from)) {
        res.status(400).json({ "error" : true, "message" : "Date parameters only available on authenticated route /stocks/authed"});
        return;
      }
      
      res.status(200).json(row)
    })
    .catch((err) => {
      console.log(err);
      res.json({"error" : true, "message" : "Error in MySQL query"})
    })
});


//Lambda function for JWT authorization
const authorize = (req, res, next) => {
  const authorization = req.headers.authorization
  let token = null;

  //Retrieve token
  if (authorization && authorization.split(" ").length == 2) {
    token = authorization.split(" ")[1];

  } else {
    res.status(403).json({ "error" : true, "message" : "Authorization header not found" });
    return;
  }

  //Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, "webcomputing");

    if (decoded.exp < Date.now()) {
      res.status(403).json({ "error" : true, "message" : "Token has expired" });
      return;
    }

    //Permit user to advance to route
    next();

  } catch (err) {
    res.status(403).json({ "error" : true, "message" : "Token is not valid" });
    return;
  }
}


//Authed root for retrieving stock history
router.get("/authed/:symbol/", authorize, function (req, res) {
  var from = '0000-00-00';
  var to = '2999-12-31';
  
  if ((Object.keys(req.query).length > 0) && (!req.query.from || !req.query.to)) {
    res.status(400).json({ "error" : true, "message" : "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15"})
    return;
  }
  
  if (req.query.from) from = req.query.from;
  if (req.query.to) to = req.query.to;

  req.db
    .from('stocks')
    .distinct("*")
    .modify((qb) => {
      if (Object.keys(req.query).length > 0) {
        qb.where("symbol", "=", req.params.symbol).andWhere("timestamp", ">", from).andWhere("timestamp", "<=", to);

      } else {
        qb.where("symbol", "=", req.params.symbol)
      }
    })
    .orderBy("timestamp", "desc")
    .modify((qb) => { if (Object.keys(req.query).length == 0) qb.first() })
    .then((rows) => {
      if (rows.length == 0) {
        res.status(404).json({ "error" : true, "message" : "No entries avaialble for query symbol for supplied range" });
        return;
      }
      
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.json({"error" : true, "message" : "Incorrect date format"});
    })
})

module.exports = router;
