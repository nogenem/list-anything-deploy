"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkDuplicatedValues = exports.reshapeEditData = exports.reshapeSearchResult = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require("lodash.foreach");

var _lodash2 = _interopRequireDefault(_lodash);

var _SubjectData = require("../models/SubjectData");

var _SubjectData2 = _interopRequireDefault(_SubjectData);

var _Subject = require("../models/Subject");

var _Subject2 = _interopRequireDefault(_Subject);

var _handleErrors = require("./handleErrors");

var _handleErrors2 = _interopRequireDefault(_handleErrors);

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reshapeSearchResult = exports.reshapeSearchResult = function reshapeSearchResult(data) {
  var results = [];

  (0, _lodash2.default)(data, function (val) {
    var result = {
      _id: val._id,
      value: val.data[0].value,
      subject: val.subjectId.description
    };
    var tabData = val.subjectId.tabs.filter(function (tab) {
      return String(tab._id) === String(val.tabId);
    });
    result.tab = tabData[0].description;
    var fieldData = val.subjectId.fields.filter(function (field) {
      return String(field._id) === String(val.data[0].fieldId);
    });
    result.field = {
      description: fieldData[0].description,
      field_type: fieldData[0].field_type
    };
    results.push(result);
  });
  return results;
};

var reshapeEditData = exports.reshapeEditData = function reshapeEditData(data) {
  var newData = _extends({}, data, {
    data: []
  });

  (0, _lodash2.default)(Object.keys(data.data), function (fieldId) {
    newData.data.push(_extends({}, data.data[fieldId], {
      fieldId: fieldId
    }));
  });

  return newData;
};

var checkDuplicatedValues = exports.checkDuplicatedValues = function checkDuplicatedValues(subjData, res, cb) {
  _Subject2.default.findById(subjData.subjectId, { fields: true }).then(function (subject) {
    if (!subject) throw (0, _errors.invalidIdError)();

    // Checagem por valores duplicados para fields que possuem
    // is_unique = true
    var fieldsUniqueIds = subject.fields.filter(function (field) {
      return field.is_unique;
    }).map(function (field) {
      return String(field._id);
    });
    var toCheck = [];

    (0, _lodash2.default)(subjData.data, function (value) {
      if (fieldsUniqueIds.includes(String(value.fieldId))) {
        toCheck.push(new RegExp("^" + value.value + "$", "i"));
      }
    });

    if (toCheck.length) {
      // Caso seja uma operação de edit não se deve verificar
      // os dados do subjectData que esta sendo editado
      var idCheck = subjData._id ? { _id: { $ne: subjData._id || "" } } : {};
      return _SubjectData2.default.find(_extends({}, idCheck, { "data.value": { $in: toCheck } }), { "data.$": true }).then(function (result) {
        if (result.length) throw (0, _errors.duplicatedValuesError)([result[0].data[0].fieldId]);else return cb(subjData, res);
      });
    }
    return cb(subjData, res);
  }).catch(function (err) {
    return (0, _handleErrors2.default)(err, res);
  });
};