const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/dashboard", ensureAuthenticated, (req, res) =>
    res.render("dashboard", {
        name: req.user.name,
    })
);

router.get("/", ensureAuthenticated, (req, res) =>
    res.redirect("/users/login")
);

module.exports = router;
