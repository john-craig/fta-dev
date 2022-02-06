const app = require('./express');

// listen to requests
app.listen(9292);

/**
* Exports express
* @public
*/
module.exports = app;