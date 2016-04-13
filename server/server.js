var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/helpme');

// middleware and routing configuration
require('./config/middleware.js')(app, express);
require('./config/route.js')(app, express);

var port = process.env.PORT || 1337;

app.listen(port);
console.log('Server is running on ' + port);

module.exports = app;