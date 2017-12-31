"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (errors) {
  var result = {};
  (0, _lodash2.default)(errors, function (val, k) {
    var key = k;
    if (patt.test(key)) key = key.substring(key.lastIndexOf(".") + 1);
    result[key] = val.message;
  });
  return result;
};

var _lodash = require("lodash.foreach");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patt = /fields\.\d+\.\w+/g;