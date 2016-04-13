var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/helpme');

// middleware and routing configuration
require('./config/middleware.js')(app, express);
require('./config/route.js')(app, express);

module.exports = app;