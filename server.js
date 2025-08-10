const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? `http://${hostname}:${port}` : false,
      methods: ["GET", "POST"],
    },
  });


  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error("No token provided");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.username} connected`);

    socket.on("join_group", (groupId) => {
      socket.join(`group_${groupId}`);
      console.log(`${socket.username} joined group ${groupId}`);
    });

    socket.on("leave_group", (groupId) => {
      socket.leave(`group_${groupId}`);
      console.log(`${socket.username} left group ${groupId}`);
    });

    socket.on("send_message", (data) => {
    
      socket.to(`group_${data.groupId}`).emit("new_message", data);
    });



    socket.on("disconnect", () => {
      console.log(`User ${socket.username} disconnected`);
    });
  });

  global.io = io;

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
