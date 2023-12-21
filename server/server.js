require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");

app.use(cors());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

require("./routes/tank.routes")(app);
require("./routes/client.routes")(app);
require("./routes/supplier.routes")(app);
require("./routes/eventLog.routes")(app);

db.sequelize
  .sync({})
  // db.sequelize.sync({ force: true })
  .then(() => {
    console.log("Database ready for use");
  })
  .catch(() => {
    console.log("Database Error");
  });

app.listen(8000, () => {
  console.log("Listening at port 8000");
}
);

