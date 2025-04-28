const express = require('express');
const app = express();
const http = require('http');
const Server = http.createServer(app);
const socket = require('socket.io');
const path = require('path');
const io =socket(Server);


app.set("view engine", "ejs");
app.use(express.static( path.join(__dirname, "/public/css")));
app.use(express.static( path.join(__dirname, "/public/js")));

app.set("views", path.join(__dirname, "views"));

io.on('connection', function (socket) {
    socket.on("send-location",function (data) {
        io.emit("recieve-location",{id:socket.id , ...data});
    });
    socket.on("disconnect", function()  {
        io.emit("user-disconnected",socket.id)
    });
});


app.get('/', (req, res) => {
  res.render('index.ejs');
});

Server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
    });