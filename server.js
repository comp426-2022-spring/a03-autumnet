const express = require('express')
const app = express()

const args = require("minimist")(process.argv.slice(2))
// Define allowed argument name 'port'.
args["port"]
// Define a const `port` using the argument from the command line. 
// Make this const default to port 5000 if there is no argument given for `--port`.
const port = args.port || process.env.PORT || 5000

const server = app.listen(port,() => {
    console.log('App is running on port %PORT%'.replace('%PORT%',port))
})

//at /app endpoint: 'OK' message
app.get('/app/', (req, res) => {
    res.status(200).end('OK')
    res.type('text/plain')
})

// at /app/flip endpoint: results of one coin flip
app.get('/app/flip/', (req, res) => {
    res.status(200).json({ "flip" : coinFlip()})
})

// at /app/flips/# endpoint: report flip results and summary
app.get('/app/flips/:number', (req, res) => {
    var flips = coinFlips(req.params.number)
    res.status(200).json({ "raw" : flips, "summary" : countFlips(flips)})
})

// at /app/flip/call/heads: user guesses heads, report results of a coin flip and compare to call
app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).json(flipACoin("heads"))
})

// at /app/flip/call/heads: user guesses tails, report results of a coin flip and compare to call
app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).json(flipACoin("tails"))
})

// default endpoint gives 404 error and message 
app.use(function(req, res) {
    res.status(404).end("Endpoint does not exist")
    res.type("text/plain")
})

//one coin flip
function coinFlip() {
    return Math.random() > 0.5 ? ("heads") : ("tails")
}

//multiple coin flips based on user input/endpoint
function coinFlips(flips) {
    var flipList = new Array();
    if (flips < 1 || typeof flips == 'undefined') {
      flips = 1;
    }
    for (var i = 0; i < flips; i++) {  
      flipList.push(coinFlip());
    }
    return flipList;
}

//count number of heads and tails following multiple flips and return summary
function countFlips(array) {
    var h = 0;
    var t = 0;
    for (let i  = 0; i < array.length; i++) {
      if (array[i] == 'heads') {
        h++;
      }
      if (array[i] == 'tails') {
        t++;
      }
    }
    return {heads: h, tails: t};
}

//user defines call with endpoint, one coin flip, results of flip and comparison to guess are returned
function flipACoin(call) {
    let flip = coinFlip()
    let result = '';
    if (flip == call) {
      result = 'win';
    } else {
      result = 'lose';
    }
    return {call: call, flip: flip, result: result}
}