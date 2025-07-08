const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const m1 = require("./model/userModel");
const m2 = require("./model/galleryModel");
dotenv.config();
const path = require("path");

const app = express();

// database sync to table
// (async () => {
//   await m2.sync({ alter: true });
// })();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  db.authenticate()
    .then(() => {
      res.json({ msg: "Connection has been established successfully." });
    })
    .catch((error) => {
      res.json({ msg: error });
    });
});
app.use("/api", require("./routes/router"));

app.use("/images", express.static(path.join(__dirname, "./file")));
app.listen(process.env.APP_PORT, async () => {
  console.log("server up and running on port " + process.env.APP_PORT);
});

module.exports = app;
