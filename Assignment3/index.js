const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const port = 8004;

// use sessions for tracking logins
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// router for api
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});