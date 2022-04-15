/*

This file is the API for the application, it is used to get the data from the database and send it to the front end.

*/

// create express router for api
const express = require('express');
const router = express.Router();

// sqlite database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('DFC.db');

function dball(sql, params) {
    return new Promise((res, rej) => {
        db.all(sql, params, (e, rows) => {
            if (e) rej(e);
            else res(rows);
        });
    });
}

// import bcrypt
const bcrypt = require('bcrypt');

router.get('/food', (req, res) => {
    if (req.query.id) {
        const id = parseInt(req.query.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid food id"
            });
            return;
        }
        
        db.get("SELECT Name as name, Spiciness as spiciness, Vegan as vegan, Calories as calories, Price as price FROM Food WHERE FoodID = ?", id, (err, row) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
                return;
            }
            if (!row) {
                res.status(400).json({
                    success: false,
                    message: "Invalid food id"
                });
                return;
            }

            row.vegan = row.vegan == "true";

            res.status(200).json({
                success: true,
                food: row
            });
        });
        return;
    }
    
    const type = req.query.type;
    db.all("SELECT FoodID as id, Name as name, Spiciness as spiciness, Vegan as vegan, Calories as calories, Price as price FROM Food WHERE Type = ?", type, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
            return;
        }

        rows.forEach(v => v.vegan = v.vegan == "true");

        res.status(200).json({
            success: true,
            food: rows
        });
    })
});

// auth endpoint
router.post('/auth', (req, res) => {
    // get the username and password from the request
    const username = req.body.username;
    const password = req.body.password;

    // check if they exist
    if (!username || !password) {
        res.status(400).json({
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
                    res.status(400).json({
                        success: false,
                        message: "Incorrect password"
                    });
                }
            });
        } else {
            // if the username doesn't exist, send an error
            res.status(400).json({
                success: false,
                message: "Username doesn't exist"
            });
        }
    });
});

// get logged in user
router.get('/user', (req, res) => {
    // check if the user is logged in
    if (!req.session.user) {
        res.status(400).json({
            success: false,
            message: "Not logged in"
        });
        return;
    }

    // get the user
    db.get("SELECT Username as username, FirstName as firstname, LastName as lastname, PhoneNumber as phonenumber, EmailAddress as email, PostalCode as postcode, Address as address FROM User WHERE UserID = ?", req.session.user, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        } else if (row) {
            res.status(200).json({
                success: true,
                user: row
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });
});

// register user on post to /user page
router.post('/user', (req, res) => {
    // get details from request body
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const address = req.body.address;
    const phonenumber = req.body.phonenumber;
    const postcode = req.body.postcode;

    // check password is at least 3 characters long
    if (!password || password.length < 3) {
        res.status(400).json({
            success: false,
            message: 'Password must be at least 3 characters long'
        });
        return;
    }

    // check if firstname and lastname exist
    if (!firstname || !lastname) {
        res.status(400).json({
            success: false,
            message: 'First name and last name are required'
        });
        return;
    }

    // check if username is not empty
    if (!username) {
        res.status(400).json({
            success: false,
            message: 'Username is required'
        });
        return;
    }

    // check if email is not empty
    if (!email) {
        res.status(400).json({
            success: false,
            message: 'Email is required'
        });
        return;
    }

    // check if address is not empty
    if (!address) {
        res.status(400).json({
            success: false,
            message: 'Address is required'
        });
        return;
    }

    // check if postcode is not empty
    if (!postcode) {
        res.status(400).json({
            success: false,
            message: 'Postcode is required'
        });
        return;
    }

    // check if phonenumber is not empty
    if (!phonenumber) {
        res.status(400).json({
            success: false,
            message: 'Phone number is required'
        });
        return;
    }

    db.get("SELECT * FROM User WHERE Username = ?", username, (err, row) => {
        if (row) {
            res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
            return;
        }

        // check if email is unique
        db.get("SELECT * FROM User WHERE Email = ?", email, (err, row) => {
            if (row) {
                res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
                return;
            }

            // hash password with bcrypt
            const hashedPassword = bcrypt.hashSync(password, 10);
            // insert user into database
            db.run("INSERT INTO User (Username, Password, EmailAddress, FirstName, LastName, Address, PhoneNumber, PostalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [username, hashedPassword, email, firstname, lastname, address, phonenumber, postcode], function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: 'Error registering user'
                    });
                } else {
                    req.session.user = this.lastID;
                    res.status(200).json({
                        success: true,
                        message: 'User registered'
                    });
                }
            });
        });
    });
});

//register order
router.get('/user/currentorder', (req, res) => {
    // check if the user is logged in
    if (!req.session.user) {
        res.status(400).json({
            success: false,
            message: "Not logged in"
        });
        return;
    }

    // get the orders
    db.get('SELECT OrderID as id, Status as status, Timestamp as timestamp FROM Orders WHERE UserID = ? AND Status = "Unfinished"', req.session.user, async (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
            return;
        } else if (!row) {
            res.status(200).json({
                success: true,
                order: []
            });
            return;
        }

        // get order products
        const products = await dball("SELECT FoodID as id, Quantity as quantity FROM OrderProduct WHERE OrderID = ?", row.id);

        res.status(200).json({
            success: true,
            order: products
        });
    });
});

router.post('/user/currentorder', (req, res) => {
    // check if the user is logged in
    if (!req.session.user) {
        res.status(400).json({
            success: false,
            message: "Not logged in"
        });
        return;
    }

    const userId = req.session.user;
    const order = req.body.order;

    db.get('SELECT OrderID as id FROM Orders WHERE UserID = ? AND Status = "Unfinished"', userId, async (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
            return;
        }

        let orderId;
        
        if (!row) {
            orderId = await new Promise((res, rej) => {
                db.run("INSERT INTO Orders (UserId, Status, Timestamp) VALUES (?,?,?)", [userId, 'Unfinished', Date.now()], function (err) {
                    if (err) rej(err);
                    else res(this.lastID);
                });
            });
        } else {
            orderId = row.id;

            await new Promise((res, rej) => {
                db.run("DELETE FROM OrderProduct WHERE OrderId = ?", orderId, function (err) {
                    if (err) rej(err);
                    else res();
                });
            });
        }

        var stmnt = db.prepare('INSERT INTO OrderProduct VALUES (?,?,?)');
        order.forEach(item => {
            var foodId = item.id;
            var quantity = item.quantity;
            stmnt.run(foodId, orderId, quantity);
        })
        stmnt.finalize();

        res.status(200).json({
            success: true,
            message: 'Success setting current order'
        });
    });
});

router.post('/user/orders', (req, res) => {
    // check if the user is logged in
    if (!req.session.user) {
        res.status(400).json({
            success: false,
            message: "Not logged in"
        });
        return;
    }

    const userId = req.session.user;

    db.get('SELECT OrderID as id FROM Orders WHERE UserID = ? AND Status = "Unfinished"', userId, async (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
            return;
        }
        if (!row) {
            console.log(err);
            res.status(400).json({
                success: false,
                message: 'No current order'
            });
            return;
        }

        db.run('UPDATE Orders SET Status = "Processing", Timestamp = ? WHERE OrderID = ?', [Date.now(), row.id]);

        res.status(200).json({
            success: true,
            message: 'Success adding order'
        });
    });
});

// get list of orders
router.get('/user/orders', (req, res) => {
    // check if the user is logged in
    if (!req.session.user) {
        res.status(400).json({
            success: false,
            message: "Not logged in"
        });
        return;
    }

    // get the orders
    db.all("SELECT OrderID as id, Status as status, Timestamp as timestamp FROM Orders WHERE UserID = ?", req.session.user, async (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
            return;
        } else if (!rows) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
            return;
        }

        // get order products
        for (let i = 0; i < rows.length; i++) {
            const products = await dball("SELECT FoodID as id, Quantity as quantity FROM OrderProduct WHERE OrderID = ?", rows[i].id);

            if (!products) {
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
                return;
            }

            // add products to order

            rows[i].products = products;
        }

        res.status(200).json({
            success: true,
            orders: rows
        });
    });
});

// export
module.exports = router;