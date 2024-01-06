import 'dotenv/config.js';
import app from './src/app.js';
import { Server } from 'socket.io';
import http from 'http';


const server = http.createServer(app);
const io = new Server(server); 

io.on('connection', (socket) => {
    console.log('a user conected ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected'); 
    });
    socket.on('client-msg', (msg) => {
        //console.log('Client ====> ', msg);
        //io emits to all clients, socket emits 1 to 1
        io.emit('server-msg', msg);
    })
});


const PORT = process.env.PORT || 8000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
server.listen(PORT, () => {
    console.log(`server started as http://${process.env.HOSTNAME}:${PORT}`);
});
