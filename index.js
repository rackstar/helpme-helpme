var app = require('./server/server.js');

var port = process.env.PORT || 1337;

app.listen(port);
console.log('Server is running on ' + port);