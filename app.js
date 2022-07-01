
var express = require('express');
var cookieParser = require('cookie-parser');
var http = require('http');
var path = require('path');
const cors = require('cors')
var staticDir = path.join(__dirname, 'public');
const config = require('./db/config/config_detail');
logging         = require('./src/utils/logging')

var app = express();
const bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.get('/', function (req, res) {
	res.redirect('/api');
});


app.set('port', config.port);
// Declares the environment to use in `config.json`
var devEnv = app.get('env') == 'development';

app.use(cookieParser())

// The following settings applies to all environments

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*')

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true)

	// Pass to next layer of middleware
	next()
})

// holding the error and saving from the crash starts here
process.on('uncaughtException', function (err) {
	console.log(err.stack)
})

app.use('/user',
	require('./src/routes/userRoutes')(app));

app.use('/admin',
	require('./src/routes/adminRoutes')(app));



const httpsServer = http.createServer(app);
httpsServer.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
})

module.exports = app;