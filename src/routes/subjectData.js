"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require("lodash.foreach");

var _lodash2 = _interopRequireDefault(_lodash);

var _escapeStringRegexp = require("escape-string-regexp");

var _escapeStringRegexp2 = _interopRequireDefault(_escapeStringRegexp);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

var _SubjectData = require("../models/SubjectData");

var _SubjectData2 = _interopRequireDefault(_SubjectData);

var _Subject = require("../models/Subject");

var _Subject2 = _interopRequireDefault(_Subject);

var _handleErrors = require("../utils/handleErrors");

var _handleErrors2 = _interopRequireDefault(_handleErrors);

var _subjectDataRouteUtils = require("../utils/subjectDataRouteUtils");

var _errors = require("../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.use(_authenticate2.default);

router.get("/", function (req, res) {
  if (req.query.tabId) {
    // findByTabId
    _SubjectData2.default.find({ tabId: req.query.tabId }, { data: true, tabId: true }).then(function (data) {
      if (data) res.json({ subjectData: data });else throw (0, _errors.invalidIdError)();
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  } else if (req.query._id) {
    // findById
    _SubjectData2.default.findById(req.query._id, { data: true, tabId: true }).then(function (data) {
      if (data) res.json({ subjectData: [data] });else throw (0, _errors.invalidIdError)();
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  } else if (req.query.query) {
    // findByQuery [restringido aos dados do usuário]
    _Subject2.default.find({ userId: req.currentUser._id }, { _id: true }).then(function (subjects) {
      if (!subjects) {
        res.json({ subjectData: [] });
        return null;
      }

      var ids = subjects.map(function (subject) {
        return subject._id;
      });
      return _SubjectData2.default.find({
        subjectId: { $in: ids },
        "data.value": {
          $regex: (0, _escapeStringRegexp2.default)(req.query.query),
          $options: "i"
        }
      }, { "data.$": true, tabId: true }).populate("subjectId", "description tabs fields");
    }).then(function (data) {
      if (data) res.json({ subjectData: (0, _subjectDataRouteUtils.reshapeSearchResult)(data) });
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  } else {
    (0, _handleErrors2.default)((0, _errors.invalidRequestError)(), res);
  }
});

var createSubjectData = function createSubjectData(data, res) {
  return _SubjectData2.default.create(data).then(function (subjectData) {
    return res.json({
      subjectData: {
        _id: subjectData._id,
        tabId: subjectData.tabId,
        data: subjectData.data
      }
    });
  });
};

router.post("/", function (req, res) {
  var subjData = _extends({}, req.body);
  (0, _subjectDataRouteUtils.checkDuplicatedValues)(subjData, res, createSubjectData);
});

var editSubjectData = function editSubjectData(subjData, res) {
  var ObjectId = _mongoose2.default.Types.ObjectId;
  var values = subjData.data;

  if (!values.length) {
    (0, _handleErrors2.default)((0, _errors.invalidRequestError)(), res);
    return;
  }

  var updates = [];
  try {
    updates.push({
      updateOne: {
        filter: { _id: ObjectId(subjData._id) },
        update: { tabId: subjData.tabId }
      }
    });
    (0, _lodash2.default)(values, function (elem) {
      updates.push({
        updateOne: {
          filter: { "data._id": ObjectId(elem._id) },
          update: { "data.$.value": elem.value }
        }
      });
    });
  } catch (err) {
    (0, _handleErrors2.default)(err, res);
    return;
  }
  _SubjectData2.default.bulkWrite(updates).then(function () {
    return _SubjectData2.default.find({ _id: subjData._id }, { data: true, tabId: true });
  }).then(function (data) {
    return res.json({ subjectData: data });
  }).catch(function (err) {
    return (0, _handleErrors2.default)(err, res);
  });
};

router.put("/", function (req, res) {
  var subjData = (0, _subjectDataRouteUtils.reshapeEditData)(req.body);
  (0, _subjectDataRouteUtils.checkDuplicatedValues)(subjData, res, editSubjectData);
});

router.delete("/", function (req, res) {
  if (req.query._id) {
    var _id = req.query._id;
    _SubjectData2.default.deleteOne({ _id: _id }).then(function (val) {
      if (val) res.json({ _id: _id });else throw (0, _errors.invalidIdError)();
    }).catch(function (err) {
      return (0, _handleErrors2.default)(err, res);
    });
  } else {
    (0, _handleErrors2.default)((0, _errors.invalidRequestError)(), res);
  }
});

exports.default = router;