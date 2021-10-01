import sqlite3 from 'sqlite3';
import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

interface Chat {
  nickname: string;
  message: string;
  timestamp: Date;
}

const db = new sqlite3.Database('./db/chat.sqlite3');
// db.serialize(() => {
//   db.run('CREATE TABLE chat (nickname TEXT, message TEXT, timestamp TEXT)');
// });

function insertChat(data: Chat) {
  const stm = `INSERT INTO chat VALUES ('${data.nickname}','${data.message}','${data.timestamp}')`;
  db.prepare(stm).run();
}

function getChats() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM chat', (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

db.prepare('DELETE FROM chat').run();

const PORT = 3000;
const app = express();
const httpServer = http.createServer(app);
const socket = new Server(httpServer);

socket.on('connection', async (client) => {
  client.emit('history', await getChats());
  client.on('send', (data: Omit<Chat, 'timestamp'>) => {
    const chat: Chat = { ...data, timestamp: new Date() };
    insertChat(chat);
    client.broadcast.emit('response', chat);
  });
});

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.resolve(__dirname, '../node_modules/socket.io-client/dist')));
app.use(express.static(path.resolve(__dirname, '../node_modules/bootstrap/dist')));

httpServer.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
