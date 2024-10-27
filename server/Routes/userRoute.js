const express = require("express");
const {registerUser, loginUser, getUsers, findUser, getId} = require("../Controllers/userController")

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/find/:userId", findUser)
router.get("/", getUsers)
router.get("/getId/:email", getId)

module.exports = router;