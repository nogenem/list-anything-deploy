"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parseErrors = require("./parseErrors");

var _parseErrors2 = _interopRequireDefault(_parseErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isMongooseObjectIdError = function isMongooseObjectIdError(err) {
  return err.name === "CastError" && err.kind === "ObjectId" || err.message === "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters";
};

exports.default = function (err, res) {
  if (err.kind === "CustomError") {
    res.status(err.status).json({ errors: err.msgObj });
  } else if (isMongooseObjectIdError(err)) {
    // Erro de cast de object id lançado pelo mongoose
    res.status(400).json({ errors: { global: "Invalid id" } });
  } else if (err.errors) {
    // Erros vindos do mongoose e referentes a campos de alguma collection
    res.status(400).json({ errors: (0, _parseErrors2.default)(err.errors) });
  } else {
    console.error(err);
    res.status(500).json({});
  }
};