"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _mailer = require("../mailer");

var _handleErrors = require("../utils/handleErrors");

var _handleErrors2 = _interopRequireDefault(_handleErrors);

var _errors = require("../utils/errors");

var _getHostName = require("../utils/getHostName");

var _getHostName2 = _interopRequireDefault(_getHostName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/", function (req, res) {
  var credentials = req.body.credentials;

  _User2.default.findOne({ email: credentials.email }).then(function (user) {
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      (0, _handleErrors2.default)((0, _errors.invalidCredentialsError)(), res);
    }
  });
});

router.post("/confirmation", function (req, res) {
  var token = req.body.token;
  _User2.default.findOneAndUpdate({ confirmationToken: token }, { confirmationToken: "", confirmed: true }, { new: true }).then(function (user) {
    return user ? res.json({ user: user.toAuthJSON() }) : res.status(400).json({});
  });
});

router.post("/reset_password_request", function (req, res) {
  var host = (0, _getHostName2.default)(req.headers);

  _User2.default.findOne({ email: req.body.email }).then(function (user) {
    if (user) {
      (0, _mailer.sendResetPasswordEmail)(user, host);
      res.json({});
    } else {
      (0, _handleErrors2.default)((0, _errors.noUserWithSuchEmailError)(), res);
    }
  });
});

router.post("/validate_token", function (req, res) {
  _jsonwebtoken2.default.verify(req.body.token, process.env.JWT_SECRET, function (err) {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

router.post("/reset_password", function (req, res) {
  var _req$body$data = req.body.data,
      password = _req$body$data.password,
      token = _req$body$data.token;

  _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      (0, _handleErrors2.default)((0, _errors.invalidTokenError)(), res);
    } else {
      _User2.default.findOne({ _id: decoded._id }).then(function (user) {
        if (user) {
          user.setPassword(password);
          user.save().then(function () {
            return res.json({});
          });
        } else {
          (0, _handleErrors2.default)((0, _errors.invalidTokenError)(), res);
        }
      });
    }
  });
});

exports.default = router;