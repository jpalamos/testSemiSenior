
const fs = require('fs');
const { createSecureServer } = require("http2")
const { createServer } = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require('./dashboard');
const { checkTokenSocket } = require('../../app/middlewares/security.service');
// const { initializeSocket } = require('./dashboard');

class MySocketHandler {
  constructor(app) {
    this.app = app;
    this.initialize();
    this.connectedUsersByRole = {
      roleId1: 0,
      roleId2: 0,
      roleId3: 0,
    };
  }

  initialize() {
    this.server =
      process.env.HTTPS
        ? createSecureServer({
          allowHTTP1: true,
          cert: fs.readFileSync(process.env.BOSTOMGYM_SSL_CERT),
          key: fs.readFileSync(process.env.BOSTOMGYM_SSL_KEY)
        }, this.app)
        : createServer(this.app);

    this.io = process.env.HTTPS ?
      new Server(this.server, {
        cors: { origin: process.env.BOSTOMGYM_SSL_ORIGIN, credentials: false, methods: ["GET", "POST"] },
        path: "/events/"
      })
      :
      new Server(this.server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
        path: "/events/"
      }
      );
    this.io.of('/events').use((socket, next) => {
      checkTokenSocket(socket.handshake.auth.token)
        .then((user) => {
          socket.user = user;
          next()
        })
        .catch((err) => console.error(err))
    });
    this.io.of('/events').on('connection', (socket) => {
      console.log('\x1b[36ma user connected:' + socket.user.username + ' \x1b[0m');

      this.connectedUsersByRole['roleId' + socket.user.roleId]++;
      this.io.of('/events').emit('dashboard:updateOnline', this.connectedUsersByRole);

      socket.on("disconnect", () => {
        console.log('\x1b[36ma user disconected:' + socket.user.username + ' \x1b[0m');
        this.connectedUsersByRole['roleId' + socket.user.roleId]--;
        this.io.of('/events').emit('dashboard:updateOnline', this.connectedUsersByRole);
      });

      socket.on("connect_error", (err) => {
        console.error(err);
        console.log(`connect_error due to ${err.message}`);
      });

      socket.on("message", (message) => {
        console.log(`Received message from client ${socket.id}: ${message}`);
      });

      initializeSocket(socket)

    });
    this.server.listen(process.env.BOSTONGYM_PORT, () => console.log(`Server is running on port ${process.env.BOSTONGYM_PORT}`));
  }


  emit(event, payload) {
    this.io.of('/events').emit(event, payload);
  }

}

module.exports = MySocketHandler