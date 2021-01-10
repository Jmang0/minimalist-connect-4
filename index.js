// SETUP
// Express - the web framework
var express = require('express')
var app = express()

// Static files
app.use(express.static('static'))

// ROUTES
// arguements are: request & response
app.get('/', function(req, res) {
    console.log(__dirname)
	res.sendFile(`${__dirname}/static/html/index.html` )
})

// START SERVER
var port = 3000

app.listen(port, function(){
    console.log(`Server started at http://127.0.0.1:${port}`) //backticks function like f-strings in python
})
