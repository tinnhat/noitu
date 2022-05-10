const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.write(`<h1>Socket IO Start on Port: ${PORT}</h1>`);
  res.end();
});
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
let messages = [];
io.on("connection", (socket) => {
  console.log("client is connected");
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("message from server", data);
  });
});
