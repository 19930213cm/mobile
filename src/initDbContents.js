var async = require("async");
var wheelchairNumbers = require("./locationLevels.js");
var size = Object.keys(wheelchairNumbers.correctLocationLevels).length;

function initChairs(db){
  var totalChrairs = wheelchairNumbers.totalChairs
  var countsDoc = {
    "_id": "countsDoc"
  };
  for (var i = 0; i < totalChrairs; i++){

    var locationId = getRandomInt(1, size +1);
    var locationName;
    var subLocationId;

    var result = setLocation(locationId);
    locationName = result.locationName;
    subLocationId = result.subLocationId;

    var chairJson = {

      "locationName": locationName,
      "locationId": locationId,
      "subLocationId": subLocationId
    }
    if (countsDoc[locationId] == null){
        countsDoc[locationId] = 0;
    }
    countsDoc[locationId] ++;
    db.insert(chairJson, function(err, res){
      if (err){
        console.log(err);
      }
    })
  }
  db.insert(countsDoc, function(err, res){
    if (err){
      console.log(err);
    }
  })

  console.log("location levels is null?" + size);
  console.log(wheelchairNumbers);
}

function randomiseChairLocations(db, callback){
  db.list({include_docs: true}, function(error,body) {
    if (error){
      callback(error);
    } else {
      db.get("countsDoc", function(err, countsDoc){
        if (err){
          callback(err);
        } else {
          var docs = body.rows;
          var response;
          for (var i =0; i < docs.length; i++){
            if (docs[i].doc._id !== "countsDoc"){
              var locationId = getRandomInt(1, size +1);
              var subLocationId;
              var result = setLocation(locationId);

              countsDoc[docs[i].doc.locationId] --;
              docs[i].doc.locationName = result.locationName;
              docs[i].doc.subLocationId = result.subLocationId;
              docs[i].doc.locationId = locationId;
              countsDoc[docs[i].doc.locationId] ++;
              //console.log(docs[i].doc);
              db.insert(docs[i].doc, function(err, resp){
                if (err){
                  callback(err);
                }
              })
            }
          }
          db.insert(countsDoc, function(err, res){
            if (err){
              callback(err);
            } else {
              callback( null , res)
            }
          })
        }
      })
    }
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function setDbDocLocation(db, id, newLocationId, callback){
  async.waterfall([
    function getDoc(asyncCb){
      db.get(id, function(err, doc){

        asyncCb(err, doc);
      })
    },
    function getCountsDoc(doc, asyncCb){
      db.get("countsDoc", function (err, countsDoc){

        countsDoc[doc.LocationId].current --;

        //update current doc
        var result = setLocation(newLocationId);
        doc.LocationId = newLocationId;
        doc.locationName = result.locationName;
        doc.subLocationId = result.subLocationId;

        countsDoc[doc.LocationId].current ++;

        asyncCb(err, doc, countsDoc);
      })
    },
    function insertUpdatedDoc(doc, countsDoc, asyncCb){
        db.insert(doc, function(err, resp){
          asyncCb(err, countsDoc)
        })
    },
    function insertUpdatedCountsDoc(countsDoc, asyncCb){
      db.insert(countsDoc, function(err, resp){
        asyncCb(err, resp)
      })
    }
  ], function(err, resp){
      if (err){
        callback(err);
      } else {
        callback(null, resp);
      }
  })
}

function checkForWarnings(db, callback){
  db.get("countsDoc", function(err, countsDoc){
    if (err){
      callback(err);
    } else{
      var alerts = [];
      var alertMsg = {};
      var warningLevels = wheelchairNumbers.correctLocationLevels;
      for( var locationId in warningLevels){
          console.log(locationId);
          if (warningLevels[locationId].warning >= countsDoc[locationId]){
            if (warningLevels[locationId].critical >= countsDoc[locationId]){
                alertMsg = {
                  "locationId": locationId,
                  "critical": true,
                  "warningLvl": warningLevels[locationId].warning,
                  "criticalLvl": warningLevels[locationId].critical,
                  "required": warningLevels[locationId].critical - countsDoc[locationId] + 1
                }
            } else{
              alertMsg = {
                "locationId":  locationId,
                "critical": false,
                "warningLvl": warningLevels[locationId].warning,
                "criticalLvl": warningLevels[locationId].critical,
                "required": warningLevels[locationId].warning - countsDoc[locationId] + 1
              }
            }
            alerts.push(alertMsg)
          }
      }
      callback(null, alerts);
    }
  })
}

function setLocation( locationId){
  switch (locationId) {
    case 0:
      locationName = "Reception";
      subLocationId = getRandomInt(1,4);
      break;
    case 1:
      locationName = "A&E";
      subLocationId = getRandomInt(1,2);
      break;
    case 2:
      locationName = "X-Ray";
      subLocationId = getRandomInt(1,2);
      break;
    case 3:
      locationName = "Ward 1";
      subLocationId = getRandomInt(1,3);
      break;
    case 4:
      locationName = "Ward 2";
      subLocationId = getRandomInt(1,3);
      break;
    case 5:
      locationName = "Ward Optemetry";
      subLocationId = 1;
    break;

  }

  var result = {
    "locationName": locationName,
    "subLocationId": subLocationId
  };
  return result;
}

var exports = module.exports = {};
exports.randomiseChairLocations = randomiseChairLocations;
exports.setDbDocLocation = setDbDocLocation;
exports.initChairs = initChairs;
exports.checkForWarnings = checkForWarnings;
//exports.checkCorrectLevels = checkCorrectLevels;
