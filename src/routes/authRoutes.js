const express = require("express");

const router = express.Router();

const {registerUser, loginUser, refreshAccessToken, logoutUser  } = require("../controllers/authController");

const validate = require("../middleware/validateMiddleware")
const {registerUserSchema, loginUserSchema} = require("../validations/userValidation");

router.post(
    "/register",
    validate(registerUserSchema),
    registerUser
);

router.post("/login", validate(loginUserSchema), loginUser);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutUser);

module.exports = router;