var express = require("express");
var router = express.Router();
const { signout, signin, signup , isSignedIn } = require("../controllers/auth");
const {check, validationResult} = require("express-validator");

router.post("/signup",
[
   
    check("useremail","email is required").isEmail(),
    check("password","password shoudd be atleast 3 char").isLength({min:3}),

] ,signup);

router.post("/signin",
[
    check("useremail","email is required").isEmail(),
    check("password","password field is requires").isLength({min:3}),

] ,signin);



module.exports = router;