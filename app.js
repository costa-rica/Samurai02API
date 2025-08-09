require("dotenv").config();
const { sequelize } = require("samurai02db");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var chatRouter = require("./routes/chat");

var app = express();
const cors = require("cors");
// app.use(cors());
app.use(
  cors({
    credentials: true,
    exposedHeaders: ["Content-Disposition"], // <-- this line is key
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/chat", chatRouter);

const {
  onStartUpCreateEnvUsers,
  verifyCheckDirectoryExists,
} = require("./modules/onStartUp");
// Sync database and start server
sequelize
  .sync()
  .then(async () => {
    if (process.env.NODE_ENV !== "test") {
      console.log("✅ Database connected & synced");
      await onStartUpCreateEnvUsers(); // <-- Call function here
      verifyCheckDirectoryExists();
    }
  })
  .catch((error) => console.error("Error syncing database:", error));

module.exports = app;
