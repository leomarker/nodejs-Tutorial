const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedin, "login");
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.getPostLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedin = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ where: { email: email } })
    .then((userDoc) => {
      if (userDoc) {
        console.log(userDoc, "auth if");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedpassword) => {
          const user = new User({
            email: email,
            password: hashedpassword,
          });
          return user.save();
        })
        .then((result) => {
          return res.redirect("/login");
        });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.getPostLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
