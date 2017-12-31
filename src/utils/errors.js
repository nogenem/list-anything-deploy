"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noTokenError = exports.invalidTokenError = exports.noUserWithSuchEmailError = exports.invalidCredentialsError = exports.invalidRequestError = exports.duplicatedValuesError = exports.invalidIdError = exports.CustomError = undefined;

var _lodash = require("lodash.foreach");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomError = exports.CustomError = function (_Error) {
  _inherits(CustomError, _Error);

  function CustomError(msgObj) {
    var _ref;

    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;

    _classCallCheck(this, CustomError);

    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = CustomError.__proto__ || Object.getPrototypeOf(CustomError)).call.apply(_ref, [this, JSON.stringify(msgObj, null, 2)].concat(params)));

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this, CustomError);
    }

    _this.msgObj = msgObj;
    _this.kind = "CustomError";
    _this.status = status;
    return _this;
  }

  return CustomError;
}(Error);

var invalidIdError = exports.invalidIdError = function invalidIdError() {
  return new CustomError({ global: "Invalid id" });
};

var duplicatedValuesError = exports.duplicatedValuesError = function duplicatedValuesError(fields) {
  var msgObj = {};
  (0, _lodash2.default)(fields, function (field) {
    msgObj[field] = "Can't have duplicates";
  });
  return new CustomError(msgObj);
};

var invalidRequestError = exports.invalidRequestError = function invalidRequestError() {
  return new CustomError({ global: "Invalid request" });
};

var invalidCredentialsError = exports.invalidCredentialsError = function invalidCredentialsError() {
  return new CustomError({ global: "Invalid credentials" });
};

var noUserWithSuchEmailError = exports.noUserWithSuchEmailError = function noUserWithSuchEmailError() {
  return new CustomError({ global: "There is no user with such email" });
};

var invalidTokenError = exports.invalidTokenError = function invalidTokenError() {
  return new CustomError({ global: "Invalid token" });
};

var noTokenError = exports.noTokenError = function noTokenError() {
  return new CustomError({ global: "No token" });
};