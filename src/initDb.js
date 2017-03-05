
var dbContents = require("./initDbContents.js");

var nano = require('nano')("http://localhost:5984", function(err, res){
  if ("err"){
    console.log(err);
  } else{
    console.log(res);
  }
});

var chairsDb = nano.db.use("chairs", function(err, res){
  if (err){
    console.log(err);
  } else{
    console.log(res);
  }
})

//fill chairs db with randomly generated data;
//dbContents.initChairs(chairsDb);

exports.chairsDb = chairsDb;
