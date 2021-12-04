var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

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
        res.status(403).json({ "error": true, "message": "Authorization header not found" });
        return;
    }

    //Verify JWT and check expiration date
    try {
        const decoded = jwt.verify(token, "CHtHAe7QgJKHXJn");

        if (decoded.exp < Date.now()) {
            res.status(403).json({ "error": true, "message": "Token has expired" });
            return;
        }

        //Permit user to advance to route and save the encapsulated email
        current_user = decoded.id;
        next();

    } catch (err) {
        res.status(403).json({ "error": true, "message": "Invalid token" });
        return;
    }
}

/* GET home page. */
router.get('/:page/:id', async function (req, res, next) {
    
    // The id of the element to search for
    var id = req.params.id;
    var page = req.params.page;

    // Get the results
    const result = await db
        .select('*')
        .from('CMS')
        .where("element_id", id)
        .where("page", page);
    
    res.json({
        items: result
    });
});

router.post('/:page/:id', authorize, async function (req, res, next) {

    // The id of the element to search for
    var id = req.params.id;
    var page = req.params.page;

    var html = req.body.data;

    const result = await db
        .update({ data: html })
        .from('CMS')
        .where("element_id", id)
        .where("page", page);

    res.sendStatus(200);
});

module.exports = router;
