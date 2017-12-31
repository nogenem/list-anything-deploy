"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongooseUniqueValidator = require("mongoose-unique-validator");

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    unique: true
  },
  passwordHash: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  confirmationToken: { type: String, default: "" }
}, { timestamps: true, runSettersOnQuery: true });

schema.methods.isValidPassword = function isValidPassword(password) {
  return _bcrypt2.default.compareSync(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = _bcrypt2.default.hashSync(password, 10);
};

schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  return _jsonwebtoken2.default.sign({
    _id: this._id
  }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

schema.methods.generateResetPasswordUrl = function generateResetPasswordUrl(host) {
  return host + "/reset_password/" + this.generateResetPasswordToken();
};

schema.methods.generateConfirmationUrl = function generateConfirmationUrl(host) {
  return host + "/confirmation/" + this.confirmationToken;
};

schema.methods.generateJWT = function generateJWT() {
  return _jsonwebtoken2.default.sign({
    email: this.email,
    confirmed: this.confirmed
  }, process.env.JWT_SECRET);
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    confirmed: this.confirmed,
    token: this.generateJWT()
  };
};

schema.plugin(_mongooseUniqueValidator2.default, { message: "This email is already taken" });

exports.default = _mongoose2.default.model("User", schema);