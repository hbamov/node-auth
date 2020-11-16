module.exports = {
    registrationValidation: (body) => {
        return [
            //name must not be empty
            body("name")
                .not()
                .isEmpty()
                .withMessage("Name is a required field.")
                .trim()
                .escape(),
            // username must be an email
            body("email", "Email is not in the right format.")
                .isEmail()
                .normalizeEmail(),
            // password must be at least 5 chars long
            body("password")
                .isLength({ min: 6 })
                .withMessage("Password must be at least 6 characters.")
                .custom((value, { req, loc, path }) => {
                    if (value !== req.body.confirmPassword) {
                        return false;
                    } else {
                        return true;
                    }
                })
                .withMessage("Passwords don't match."),
        ];
    },
};
