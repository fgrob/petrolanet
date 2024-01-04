require("dotenv").config();
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
  }
});
const db = require("./models");

app.use(cors());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {

  console.log("socket.io: user connected");

  app.set("socket", socket); // Hace el objeto io accesible a través de req.app

  socket.on("disconnect", () => {
    console.log("socket.io: user disconnected");
  });
});

require("./routes/tank.routes")(app);
require("./routes/client.routes")(app);
require("./routes/supplier.routes")(app);
require("./routes/eventLog.routes")(app);

db.sequelize
  .sync({})
  .then(() => {
    console.log("Database connection OK");
  })
  .catch((err) => {
    console.log("Database connection Error");
    console.error(err);
  });

port = process.env.PORT;
// app.listen(port, () => {
server.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
