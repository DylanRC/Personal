var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var router = express.Router();


//User registration
router.post("/register", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ "error": true, "message": "Request body incomplete - email and password needed" });
    return;
  }

  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((users) => {
      if (users.length > 0) {
        res.status(409).json({ "error" : true, "message" : "User already exists!"})
        return;
      }

      // Insert user into db
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      return req.db.from("users").insert({ email, hash });
    })
    .then(() => {
      res.status(201).json({ "success" : true, "message" : "User created" });
    })
});


//User login
router.post("/login", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ "error": true, "message": "Request body incomplete - email and password needed" })
    return;
  }

  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((users) => {
      if (users.length == 0) {
        res.status(401).json({ "error" : true, "message" : "Incorrect email or password" });
        return 2;
      }
      
      //Compare password hashes
      const user = users[0];
      return bcrypt.compare(password, user.hash)
    })
    .then((match) => {
      if (match === 2) return;
      if (!match) {
        res.status(401).json({ "error" : true, "message" : "Incorrect email or password" });
        return;
      }
      
      //Create and return JWT token
      const secretKey = "webcomputing";
      const expires_in = 60 * 60 * 24; // 1 Day
      const exp = Date.now() + expires_in * 1000;
      const token = jwt.sign({ email, exp }, secretKey);
      res.status(200).json({ "token": token, token_type: "Bearer", "expires_in": expires_in });
    })
})

module.exports = router;
