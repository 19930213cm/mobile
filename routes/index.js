
var initDb = require("../src/initDb.js");
var initDbContents = require("../src/initDbContents.js");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route("/randomiseChairLocations").get(function (req, res){
  initDbContents.randomiseChairLocations(initDb.chairsDb, function(error, response){
    if(error){
      res.status(error.statusCode).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})

router.route("/setChairLocation").get(function (req, res){
  initDbContents.setDbDocLocation(initDb.chairsDb, req.params.docId, req.params.newLocationId, function(error, response){
    if(error){
      res.status(error.statusCode).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})


module.exports = router;
