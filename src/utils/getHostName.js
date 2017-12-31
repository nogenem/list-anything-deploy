"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (headers) {
  if (headers["x-forwarded-host"]) return headers["x-forwarded-proto"] + "://" + headers["x-forwarded-host"];

  if (headers.referer) {
    var _host = headers.referer;
    var index = _host.replace(/https?:\/\//, "").indexOf("/");
    return _host.substring(0, index);
  }

  var host = headers.host;
  if (!host.startsWith("http")) host = "http://" + host;
  return host;
};