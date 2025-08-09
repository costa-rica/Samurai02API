var express = require("express");
var router = express.Router();
const { User } = require("samurai02db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { checkBodyReturnMissing } = require("../modules/common");

// POST /data/receive-structured-data
router.post("/receive-structured-data", async (req, res) => {
    console.log("- in POST /data/receive-structured-data")
    
});

module.exports = router;

    