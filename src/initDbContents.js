function initChairs(db){
  for (var i = 0; i < 20; i++){

    var locationId = getRandomInt(0, 5);
    var locationName;
    var subLocationId;

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
    var chairJson = {

      "locationName": locationName,
      "locationId": locationId,
      "subLocationId": subLocationId
    }

    db.insert(chairJson, function(err, res){
      if (err){
        console.log(err);
      }
    })
  }
}

function randomiseChairLocations(db, callback){
  db.list({include_docs: true}, function(error,body) {
    if (error){
      callback(error);
    } else {
      var docs = body.rows;
      var response;
      for (var i =0; i < docs.length; i++){
        var locationId = getRandomInt(0, 5);
        var subLocationId;

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
        docs[i].doc.locationName = locationName;
        docs[i].doc.subLocationId = subLocationId;
        docs[i].doc.locationId = locationId;
        //console.log(docs[i].doc);
        db.insert(docs[i].doc, function(err, resp){
          if (err){
            callback(err);
          } else {
            response = resp;
          }
        })
      }
      callback(null, response);
    }
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var exports = module.exports = {};
exports.randomiseChairLocations = randomiseChairLocations;
exports.initChairs = initChairs;
