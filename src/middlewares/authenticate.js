"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _errors = require("../utils/errors");

var _handleErrors = require("../utils/handleErrors");

var _handleErrors2 = _interopRequireDefault(_handleErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (req, res, next) {
  var header = req.headers.authorization;
  var token = void 0;

  if (header) token = header.split(" ")[1];

  if (token) {
    _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        (0, _handleErrors2.default)((0, _errors.invalidTokenError)(), res);
      } else {
        _User2.default.findOne({ email: decoded.email }).then(function (user) {
          if (!user) {
            (0, _handleErrors2.default)((0, _errors.invalidTokenError)(), res);
            req.currentUser = null;
            return;
          }
          req.currentUser = user;
          next();
        });
      }
    });
  } else {
    (0, _handleErrors2.default)((0, _errors.noTokenError)(), res);
  }
};