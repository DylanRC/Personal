var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

const db = require('../db-config.js');

var current_user = null;

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
      const decoded = jwt.verify(token, "CHtHAe7QgJKHXJn");
  
      if (decoded.exp < Date.now()) {
        res.status(403).json({ "error" : true, "message" : "Token has expired" });
        return;
      }
  
      //Permit user to advance to route and save the encapsulated email
      current_user = decoded.id;
      next();
  
    } catch (err) {
      res.status(403).json({ "error" : true, "message" : "Invalid token" });
      return;
    }
}

//Need to add error checking
router.get("/results", authorize, function (req, res) {

    db
      .select("result")
      .from("TestResults")
      .where({user_id: current_user})
      .then((results) => {
        if (results.Length < 1) {
          res.status(409).json({ "error" : true, "message" : "No results to display"})
          return;  
        }

        res.status(200).json(results)
      })
});

//Need to add error checking
router.post("/postResults", authorize, function (req, res) {
  const email = req.body.email;
  const results = req.body.result;

  db
    .from("User")
    .first("admin")
    .where({id: current_user})
    .then((result) => {
      if (result.admin === 0) {
        res.status(409).json({ "error" : true, "message" : "You are not authorised to complete this action"})
        return;
      }

      db
      .from("User")
      .first("id")
      .where({email: email})
      .then((row) => {
        return db.from("TestResults").insert({ user_id: row.id, result: results });
      })
      .then(() => {
        res.status(201).json({ "success" : true, "message" : "Result added" });
      })   
  })
})

module.exports = router;