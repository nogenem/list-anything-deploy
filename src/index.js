"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require("helmet");

var _helmet2 = _interopRequireDefault(_helmet);

var _auth = require("./routes/auth");

var _auth2 = _interopRequireDefault(_auth);

var _users = require("./routes/users");

var _users2 = _interopRequireDefault(_users);

var _subjects = require("./routes/subjects");

var _subjects2 = _interopRequireDefault(_subjects);

var _subjectData = require("./routes/subjectData");

var _subjectData2 = _interopRequireDefault(_subjectData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
_mongoose2.default.Promise = _bluebird2.default;

var staticFiles = _path2.default.join(__dirname, "index.html");
if (process.env.MY_NODE_ENV === "production") {
  app.use((0, _helmet2.default)());
  app.use((0, _compression2.default)());

  staticFiles = _express2.default.static(_path2.default.join(__dirname, "../build-client/"));
  app.use(staticFiles);
}

_mongoose2.default.connect(process.env.MONGODB_URL, { useMongoClient: true });

app.use("/api/auth", _auth2.default);
app.use("/api/users", _users2.default);
app.use("/api/subjects", _subjects2.default);
app.use("/api/subjects/data", _subjectData2.default);

if (process.env.MY_NODE_ENV === "production") {
  app.use("/*", staticFiles);
} else {
  app.get("/*", function (req, res) {
    res.sendFile(staticFiles);
  });
}

var port = process.env.PORT || 8080;
app.listen(port, function () {
  return console.log("Running on port " + port);
});