const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      useremail: user.email,
      id: user._id
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { useremail, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ useremail }, (err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "USER useremail does not exists"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "useremail and password do not match"
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, useremail, role } = user;
    return res.json({ token, user: { _id, name, useremail, role } });
  });
};

exports.signout = (req, res) => {
  res.json({
    message: "User signout"
  });
};


// protected routes

exports.isSignedIn = expressJwt({
  secret:'secret',
  userProperty: "auth"
})

//custom middlewares 
exports.isAuthenticated = (req, res, next) => {

  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  
  if (!checker){
    return res.status(403).json({
      error: " ACCESS DENIED"
    })
  }

  next();
}

