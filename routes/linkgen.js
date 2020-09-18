// routes/users.js

var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* GET user profile. */
router.get('/linkgen', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  //res.sendFile('/views/index.html');
  
  res.render('linkgen', {
   // userProfile: JSON.stringify(userProfile, null, 2),
   // title: 'Profile page'
  });
  
});

module.exports = router;