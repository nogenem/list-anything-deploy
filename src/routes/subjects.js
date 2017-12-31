"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

var _Subject = require("../models/Subject");

var _Subject2 = _interopRequireDefault(_Subject);

var _SubjectData = require("../models/SubjectData");

var _SubjectData2 = _interopRequireDefault(_SubjectData);

var _handleErrors = require("../utils/handleErrors");

var _handleErrors2 = _interopRequireDefault(_handleErrors);

var _errors = require("../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.use(_authenticate2.default);

router.get("/", function (req, res) {
  if (req.query._id) {
    // findById
    _Subject2.default.findById(req.query._id, {
      description: true,
      tabs: true,
      fields: true
    }).then(function (subject) {
      if (subject) res.json({ subject: subject });else throw (0, _errors.invalidIdError)();
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  } else if (req.query.tabId) {
    // findByTabId
    _Subject2.default.findOne({ "tabs._id": req.query.tabId }, {
      description: true,
      tabs: true,
      fields: true
    }).then(function (subject) {
      if (subject) res.json({ subject: subject });else throw (0, _errors.invalidIdError)();
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  } else {
    // findByUserId
    _Subject2.default.find({ userId: req.currentUser._id }, { _id: true, description: true }).then(function (subjects) {
      return res.json({ subjects: subjects });
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  }
});

router.post("/", function (req, res) {
  _Subject2.default.findOne({
    userId: req.currentUser._id,
    description: req.body.subject.description
  }).then(function (data) {
    if (data) throw (0, _errors.duplicatedValuesError)(["description"]);else {
      return _Subject2.default.create(_extends({}, req.body.subject, {
        userId: req.currentUser._id
      }));
    }
  }).then(function (subject) {
    return res.json({
      subject: { _id: subject._id, description: subject.description }
    });
  }).catch(function (err) {
    return (0, _handleErrors2.default)(err, res);
  });
});

router.delete("/", function (req, res) {
  if (req.query._id) {
    var _id = req.query._id;
    _Subject2.default.findByIdAndRemove(_id, { select: "tabs" }).then(function (subject) {
      if (!subject) throw (0, _errors.invalidIdError)();else {
        var tabs = subject.tabs.map(function (tab) {
          return _mongoose2.default.Types.ObjectId(tab._id);
        });
        return _SubjectData2.default.deleteMany({ tabId: { $in: tabs } });
      }
    }).then(function () {
      return res.json({ _id: _id });
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  } else {
    (0, _handleErrors2.default)((0, _errors.invalidRequestError)(), res);
  }
});

exports.default = router;