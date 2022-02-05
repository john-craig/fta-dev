const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
/**
* Express instance
* @public
*/
const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

/* Set routes */
const mapRoutes =       require('./routes/mapRoutes');
const nationRoutes =    require('./routes/nationRoutes');

app.use('/map',     mapRoutes);
app.use('/nation',  nationRoutes);

module.exports = app;

