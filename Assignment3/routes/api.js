// create express router for api
const express = require('express');
const router = express.Router();

// add user on post to /users page
router.post('/users', (req, res) => {
    res.send('ahoy matey');
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