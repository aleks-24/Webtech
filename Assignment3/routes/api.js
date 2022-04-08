/*

This file is the API for the application, it is used to get the data from the database and send it to the front end.

*/

// create express router for api
const express = require('express');
const router = express.Router();

// sqlite database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('DFC.db');

// import bcrypt
const bcrypt = require('bcrypt');

// session test
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.send(req.session.user);
    } else {
        res.send('No session');
    }
});

// auth endpoint
router.post('/auth', (req, res) => {
    // get the username and password from the request
    const username = req.body.username;
    const password = req.body.password;

    // check if they exist
    if (!username || !password) {
        res.status(401).json({
            success: false,
            message: 'Username or password is missing.'
        });
        return;
    }

    // check if the username exists
    db.get("SELECT UserID, Username, Password FROM User WHERE Username = ?", username, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        } else if (row) {
            // check if the password is correct
            bcrypt.compare(password, row.Password, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Internal server error"
                    });
                } else if (result) {
                    // if the password is correct, set session
                    req.session.user = row.UserID;
                    res.status(200).json({
                        success: true,
                        message: "Successfully logged in"
                    });
                } else {
                    // if the password is incorrect, send an error
                    res.status(401).json({
                        success: false,
                        message: "Incorrect password"
                    });
                }
            });
        } else {
            // if the username doesn't exist, send an error
            res.status(401).json({
                success: false,
                message: "Username doesn't exist"
            });
        }
    });
});

// register user on post to /users page
router.post('/users', (req, res) => {
    // get details from request body
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const address = req.body.address;
    const phonenumber = req.body.phonenumber;
    const postcode = req.body.postcode;

    // check password is at least 4 characters long
    if (!password || password.length < 3) {
        res.status(401).json({
            success: false,
            message: 'Password must be at least 4 characters long'
        });
        return;
    }

    // check if firstname and lastname exist
    if (!firstname || !lastname) {
        res.status(401).json({
            success: false,
            message: 'First name and last name are required'
        });
        return;
    }

    // check if username is not empty
    if (!username) {
        res.status(401).json({
            success: false,
            message: 'Username is required'
        });
        return;
    }

    // check if email is not empty
    if (!email) {
        res.status(401).json({
            success: false,
            message: 'Email is required'
        });
        return;
    }

    // check if address is not empty
    if (!address) {
        res.status(401).json({
            success: false,
            message: 'Address is required'
        });
        return;
    }

    // check if postcode is not empty
    if (!postcode) {
        res.status(401).json({
            success: false,
            message: 'Postcode is required'
        });
        return;
    }

    // check if phonenumber is not empty
    if (!phonenumber) {
        res.status(401).json({
            success: false,
            message: 'Phone number is required'
        });
        return;
    }

    db.get("SELECT * FROM User WHERE Username = ?", username, (err, row) => {
        if (row) {
            res.status(401).json({
                success: false,
                message: 'Username already exists'
            });
            return;
        }

        // check if email is unique
        db.get("SELECT * FROM User WHERE Email = ?", email, (err, row) => {
            if (row) {
                res.status(401).json({
                    success: false,
                    message: 'Email already exists'
                });
                return;
            }

            // hash password with bcrypt
            const hashedPassword = bcrypt.hashSync(password, 10);
            // insert user into database
            db.run("INSERT INTO User (Username, Password, EmailAddress, FirstName, LastName, Address, PhoneNumber, PostalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [username, hashedPassword, email, firstname, lastname, address, phonenumber, postcode], function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: 'Error registering user'
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'User registered'
                    });
                }
            });
        });
    });
});

// get user details on get to /users/:id page
router.get('/users/:uid', (req, res) => {
    const uid = req.params.uid;
    res.send(`User id: ${uid}`);
});

// get list of orders on get to /users/:id/orders page
router.get('/users/:uid/orders', (req, res) => {
    const uid = req.params.uid;
    res.send(`User id: ${uid}`);
});

// get order details on get to /users/:id/orders/:oid page
router.get('/users/:uid/orders/:oid', (req, res) => {
    const uid = req.params.uid;
    const oid = req.params.oid;
    res.send(`User id: ${uid}, Order id: ${oid}`);
});

// export
module.exports = router;