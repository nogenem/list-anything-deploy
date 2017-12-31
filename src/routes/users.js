"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _mailer = require("../mailer");

var _handleErrors = require("../utils/handleErrors");

var _handleErrors2 = _interopRequireDefault(_handleErrors);

var _getHostName = require("../utils/getHostName");

var _getHostName2 = _interopRequireDefault(_getHostName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/", function (req, res) {
  var _req$body$user = req.body.user,
      email = _req$body$user.email,
      password = _req$body$user.password;

  var host = (0, _getHostName2.default)(req.headers);
  var user = new _User2.default({ email: email });

  user.setPassword(password);
  user.setConfirmationToken();
  user.save().then(function (userRecord) {
    (0, _mailer.sendConfirmationEmail)(userRecord, host);
    res.json({ user: userRecord.toAuthJSON() });
  }).catch(function (err) {
    return (0, _handleErrors2.default)(err, res);
  });
});

exports.default = router;