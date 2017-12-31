"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendResetPasswordEmail = sendResetPasswordEmail;

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var from = process.env.EMAIL_USER + " <" + process.env.EMAIL_USER + ">";

function setup() {
  if (process.env.MY_NODE_ENV === "production") {
    return _nodemailer2.default.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  // https://mailtrap.io
  return _nodemailer2.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

function sendConfirmationEmail(user, host) {
  var tranport = setup();
  var url = user.generateConfirmationUrl(host);
  var email = {
    from: from,
    to: user.email + " <" + user.email + ">",
    subject: "Welcome to ListAnything",
    html: "\n    Welcome to ListAnything. Please, confirm your email.<br/>\n\n    <a href=\"" + url + "\">" + url + "</a>\n    "
  };

  tranport.sendMail(email);
}

function sendResetPasswordEmail(user, host) {
  var tranport = setup();
  var url = user.generateResetPasswordUrl(host);
  var email = {
    from: from,
    to: user.email + " <" + user.email + ">",
    subject: "Reset Password",
    html: "\n    To reset password follow this link:<br/>\n\n    <a href=\"" + url + "\">" + url + "</a>\n    "
  };

  tranport.sendMail(email);
}