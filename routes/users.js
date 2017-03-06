var express = require('express');
var router = express.Router();
var userFunctions = require("../src/userFunctions.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route("/getAllUsers").get(function (req, res){
  userFunctions.findUserDoc( "users", "userName", function(error, response){
    if(error){
      console.log(error);
      res.status(error.statusCode).send(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})

module.exports = router;
