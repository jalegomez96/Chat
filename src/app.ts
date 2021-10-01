import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

const PORT = 5000;
const app = express();
const httpServer = http.createServer(app);
const socket = new Server(httpServer);

interface Message {
  nickname: string;
  message: string;
  timestamp: Date;
}

socket.on('connection', (client) => {
  client.on('send', (data: Omit<Message, 'timestamp'>) => {
    const message: Message = { ...data, timestamp: new Date() };
    client.broadcast.emit('response', message);
  });
});

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.resolve(__dirname, '../node_modules/socket.io-client/dist')));
app.use(express.static(path.resolve(__dirname, '../node_modules/bootstrap/dist')));

httpServer.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
