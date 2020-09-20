const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo")(session);
const exphbs = require("express-handlebars");
dotenv.config({ path: "./config/config.env" });
require("./config/passport");
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
