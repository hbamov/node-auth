const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const app = express();

// Passport config
require("./src/config/passport")(passport);

// DB Config
const db = require("./src/config/keys").MongoURI;

// Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo DB connected.....");
    })
    .catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

// Body parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", require("./src/routes/index"));
app.use("/users", require("./src/routes/users"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
