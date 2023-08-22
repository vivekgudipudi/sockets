const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
require("dotenv").config();

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("chat", (payload) => {
    io.emit("chat", payload);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

const PORT = process.env.PORT || 7000;

server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
