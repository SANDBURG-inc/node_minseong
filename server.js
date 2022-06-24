
const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true})) 

app.listen(8080, function() {
    console.log('listening on 8080')
});

app.get('/camp', function(req, res) {
    res.send('camping list')
});

app.get('/school', function(req, res) {
    res.send('elementary school?')
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/write', function(req, res) {
    res.sendFile(__dirname + '/write.html')
});

app.post('/add', function(req, res) {
    res.send('success!')
    console.log(req.body.date);
    console.log(req.body.title);
}) 