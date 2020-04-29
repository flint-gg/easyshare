import socketIO from 'socket.io';
import http from 'http';
import { Express } from 'express';
import flintURL from '../scripts/flintURL';

// this will be our instance
let io: socketIO.Server;
const chatSocketAdd = (socket: socketIO.Socket) => {
  console.log('[SOCKET] a user connected');
  socket.on('disconnect', () => {
    console.log('[SOCKET] a user disconnected');
  });
};

const options = flintURL.getWebsocketOptions();
options.origins = [
  'http://localhost:3000',
  'https://flint.gg:*',
  'https://www.flint.gg:*',
  'https://staging.flint.gg:*',
  'http://staging.flint.gg:*', // also allow unsafe here
];

export function chatSocketSetup(app: Express) {
  const server = http.createServer(app);
  io = socketIO(server, {
    // engine.IO options
    pingTimeout: 30000,
    // origins: options.origins, // seemed to not help, broke staging sockets
  });
  server.listen(options.port, () => {
    console.info(
      `socket.io listening on ${options.host}:${options.port}${options.path}`,
    );
  });
  io.on('connection', chatSocketAdd);
}

export const getIO = () => io;
/*
function send (type, msg) {
  io.emit(type, { message: msg });
};
*/
