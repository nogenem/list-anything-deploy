"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tabs = new _mongoose2.default.Schema({
  description: { type: String, required: true }
});
Tabs.index({ _id: 1 });

var Fields = new _mongoose2.default.Schema({
  description: { type: String, required: true },
  is_unique: { type: Boolean, default: false },
  show_in_list: { type: Boolean, default: false },
  field_type: { type: String, required: true }
});

var Subjects = new _mongoose2.default.Schema({
  description: { type: String, required: true },
  userId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  tabs: [Tabs],
  fields: [Fields]
}, { timestamps: true });

exports.default = _mongoose2.default.model("Subject", Subjects);