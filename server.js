import 'dotenv/config.js';
import app from './src/app.js';
import { Server } from 'socket.io';
import http from 'http';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// open the database file
const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);


const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
}); 

io.on('connection', async (socket) => {
    console.log('a user conected ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected'); 
    });
    socket.on('client-msg', async (msg) => {
        let result;
        try {
            result = await db.run('INSERT INTO messages (content) VALUES (?)', msg)
        } catch (e) {
            return;
        }
        //console.log('Client ====> ', msg);
        //io emits to all clients, socket emits 1 to 1
        io.emit('server-msg', msg, result.lastID);
    });

    if (!socket.recovered) {
    // if the connection state recovery was not successful
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [0],
        (_err, row) => {
          socket.emit('server-msg', row.content, row.id);
        }
        )
    } catch (e) {
      // something went wrong
    }
  }
});


const PORT = process.env.PORT || 8000;
const HOSTNAME = process.env.HOSTNAME || `http://localhost:${PORT}`;
server.listen(PORT, () => {
    console.log(`server started at ${HOSTNAME}`);
});
