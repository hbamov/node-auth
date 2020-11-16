const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

// User Model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register handle
router.post("/register", (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    let errors = [];

    // Check required fields
    if (!name || !email || !password || !confirmPassword) {
        errors.push({ msg: "Please fill in all fields" });
    }

    // Check passwords match
    if (password !== confirmPassword) {
        errors.push({ msg: "Passwords do not match" });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
        });
    } else {
        // Validation passed
        User.findOne({
            email: email,
        })
            .then((user) => {
                if (user) {
                    // User exists
                    errors.push({
                        msg: "Email is already registered",
                    });
                    res.render("register", {
                        errors,
                        name,
                        email,
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                    });

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            newUser
                                .save()
                                .then((user) => {
                                    req.flash(
                                        "success_msg",
                                        "You are now registered and can login"
                                    );
                                    res.redirect("/users/login");
                                })
                                .catch((err) => console.log(err));
                        })
                    );
                }
            })
            .catch();
    }
});

// Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_message", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;
