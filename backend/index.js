const app = require('./express');
//const db = require('./tinydb')
const fleetUtils = require('./utilities/fleetUtils')

fleetUtils.refreshFleets()

// listen to requests
app.listen(9292);

/**
* Exports express
* @public
*/
module.exports = app;