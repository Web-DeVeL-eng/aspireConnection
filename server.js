// const { Socket } = require('engine.io');
const http= require('http');
const express = require('express');
// const { use } = require('express/lib/application');
const app = express();
// const http = require('http').createServer(app)

const server=http.createServer(app);
const hostname= '0.0.0.0';
const port = process.env.PORT || 1000


app.use(express.static('\public'));

app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

const io = require('socket.io')(server);

let users ={}

io.on('connection',(socket)=>{
    socket.on('new-user-joined',(username)=>{
        users[socket.id]=username;
        socket.broadcast.emit('user-connected',username)
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-disconnected',username=users[socket.id]);
        delete users[socket.id];
    })

    console.log('User Connected...')
    socket.on('message', (msg)=>{
        socket.broadcast.emit('message',msg)
    })
})


server.listen( port, hostname,()=>{
    console.log(`Server Running at http://${hostname}:${port}/`)
})