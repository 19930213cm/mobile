var commonVariables = require("./userFunctionsVariables.js")
var initDb = require("./initDb.js");

function findUserDoc(dbName, userName, callback){
   initDb.useDb(dbName, function(err, db){
    if (err){
      callback(err);
    } else{
      console.log(commonVariables);
      db.view(commonVariables.designDocName, commonVariables.viewName, function(err, body) {
        if (err){
          callback(err);
        } else {
          callback(null, body);
        }
      });
    }
  })
}

var exports = module.exports = {};
exports.findUserDoc = findUserDoc;
