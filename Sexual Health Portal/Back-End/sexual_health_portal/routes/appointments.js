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

//Request an appointment
router.post('/request', authorize, function(req, res, next) {
    const date = req.body.datetime;
    var doctor = "any";
    const clinic_id = 0;
    const status = "pending";
    if(!!req.body.doctor){
        doctor = req.body.doctor;
    }

    //Check the entered date hasn't passed
    if (date > Date.now()) {
        res.status(403).json({ "error" : true, "message" : "Date has already passed" });
        return;
    }

    //Check that a doctor's appointments don't clash
    db
      .from("Appointments")
      .select("datetime")
      .whereNot({ doctor: "any" })
      .andWhere({ doctor: doctor})
      .then((datetime) => {
        if (datetime.length > 0) {
          for (let i = 0; i < datetime.length; i++) {
            if (date < (datetime + (15 * 60 * 1000)) && date > (datetime - (15 * 60 * 1000))) {
              res.status(403).json({ "error" : true, "message" : "Date is too close to existing appointment" });
              return;
            }
          }
        }
      })
      .then(() => {
        return db.from("Appointments").insert({ user_id: current_user, datetime: date, doctor: doctor, clinic_id: clinic_id, status: status });
      })
      .then(() => {
        res.status(201).json({ "success" : true, "message" : "Appointment pending" });
      })
});

//Retrieve pending or accepted appointments
router.get('/get', authorize, function(req, res, next) {

  //Check if the user has administrator privileges
  db
    .from("User")
    .first("admin")
    .where({id: current_user})
    .then((result) => {
      //If the user is not an administrator get relevent confirmed appointments
      if (result.admin === 0) {
        db
          .from("Appointments")
          .select("datetime", "doctor", "clinic_id")
          .where({ user_id: current_user})
          .andWhere({ status: "confirmed"})
          .then((rows) => {
            if (rows.Length < 1) {
              res.status(409).json({ "error" : true, "message" : "No results to display"})
              return;  
            }
    
            res.status(200).json(rows)
          })
      }
      //If the user is an administrator get pending appointments
      else {
        db
          .from("Appointments")
          .select("id", "user_id", "datetime", "doctor", "clinic_id")
          .where({ status: "pending"})
          .then((results) => {
            if (results.Length < 1) {
              res.status(409).json({ "error" : true, "message" : "No results to display"})
              return;  
            }
    
            res.status(200).json(results)
          })
      }
    })
});

//Confirm/deny appointment
router.post('/triage', authorize, function(req, res, next) {
  const id = req.body.id;
  const status = req.body.status;

  //Check if the user has administrator privileges
  db
    .from("User")
    .first("admin")
    .where({id: current_user})
    .then((result) => {
      if (result.admin === 0) {
        res.status(409).json({ "error" : true, "message" : "You are not authorised to complete this action"})
        return;
      }
      
      //Update the appointment statuss
      db("Appointments")
        .where({ id: id})
        .update("status", status)
        .then(() => {
          res.status(200).json({ "success" : true, "message" : `Appointment ${status} successfully` });
          return;
        })
      }
    )
});

module.exports = router;