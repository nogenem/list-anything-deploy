"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Data = new _mongoose2.default.Schema({
  value: { type: String },
  fieldId: { type: _mongoose2.default.Schema.Types.ObjectId, required: true // FK
  } });
Data.index({ value: 1 }, { sparse: true });

var SubjectData = new _mongoose2.default.Schema({
  tabId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    required: true,
    index: true
  }, // FK
  subjectId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    required: true,
    ref: "Subject"
  }, // FK
  data: [Data]
}, { timestamps: true });

exports.default = _mongoose2.default.model("SubjectData", SubjectData);