var express = require('express');
const bcrypt = require('bcrypt');
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

//Basic User registration
router.post("/register", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const full_name = req.body.fullName;
  const admin = 0;

  if (!email || !password) {
    res.status(400).json({ "error": true, "message": "Request body incomplete - email and password are required" });
    return;
  }

  db
    .from("User")
    .select("*")
    .where("email", "=", email)
    .then((User) => {
      if (User.length > 0) {
        res.status(409).json({ "error" : true, "message" : "User already exists!"})
        return;
      }

      // Insert user into db
      const saltRounds = 10;
      const password_hash = bcrypt.hashSync(password, saltRounds);
      return db.from("User").insert({ email, password_hash, full_name, admin });
    })
    .then(() => {
      res.status(201).json({ "success" : true, "message" : "User created" });
    })
});


//Basic User login
router.post("/login", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  var id = null;
  var fullName = null;
  var admin = null;

  if (!email || !password) {
    res.status(400).json({ "error": true, "message": "Request body incomplete - email and password needed" })
    return;
  }

  db
    .from("User")
    .select("*")
    .where("email", "=", email)
    .then((User) => {
      if (User.length == 0) {
        res.status(401).json({ "error" : true, "message" : "Incorrect email or password" });
        return 2;
      }
      
      //Compare password hashes
      const user = User[0];
      id = user.id;
      fullName = user.full_name;
      admin = user.admin;
      return bcrypt.compare(password, user.password_hash)
    })
    .then((match) => {
      if (match === 2) return;
      if (!match) {
        res.status(401).json({ "error" : true, "message" : "Incorrect email or password" });
        return;
      }
      
      //Create and return JWT token
      const secretKey = "CHtHAe7QgJKHXJn";
      const expires_in = 60 * 60 * 24; // 1 Day
      const exp = Date.now() + expires_in * 1000;
      const token = jwt.sign({ id, exp }, secretKey);
      res.status(200).json({ "token": token, token_type: "Bearer", "expires_in": expires_in, "fullName": fullName, "admin": admin });
    })
})

//Admin user creation
router.post("/edit", authorize, function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const full_name = req.body.fullName;
  const admin = req.body.admin;

  if (!email || !password) {
    res.status(400).json({ "error": true, "message": "Request body incomplete - email and password are required" });
    return;
  }

  //Check if current user has admin privilege
  db
    .from("User")
    .select("*")
    .where({id: current_user})
    .then((result) => {
      if (result === undefined || result.admin === 0) {
        res.status(409).json({ "error" : true, "message" : "You are not authorised to complete this action"})
        return;
      }

      //Add user to the database if they do not already exist
      db
        .from("User")
        .select("*")
        .where("email", "=", email)
        .then((User) => {
          if (User.length == 0) {
            res.status(409).json({ "error" : true, "message" : "User doesn't exist!"})
            return;
          }

          if (User[0].id == current_user && admin != 1) {
            res.status(409).json({ "error": true, "message": "You can't demote yourself!" })
            return;
          }

          // Insert user into db
          const saltRounds = 10;
          const password_hash = bcrypt.hashSync(password, saltRounds);

          db
            .update({ email: email, password_hash: password_hash, full_name: full_name, admin: admin })
            .from("User")
            .where("email", "=", email)
            .then(() => {
              res.status(201).json({ "success": true, "message": "User edited" });
            })
        })
    })  
});

module.exports = router;
