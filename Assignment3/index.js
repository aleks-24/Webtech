const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});