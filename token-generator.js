// module for creating JWTs
// https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken');

// Since we will be creating tokens for multiple people visitng the site,
// lets create a function which returns the JWT for each client request
module.exports = function createJWT(display_name){
    // Generate random 8 digit number for 'sub' (whom the token refers to)
    // this creates a new identity everytime a JWT is created
    var genSub = "Moment-Guest-" + (Math.floor(Math.random()*7362592) + 10000000);
    //var genSub = display_name;
    //warning: static "subject" can send the guest to same space!
    // consider using this for testing with the same space
    //var genSub = "HC02132019";
    console.log ("Generated subject ID - " + genSub);
    console.log (`got display name as - ${display_name}`);

    //create JWT paylod
    var payload = {
      "sub": genSub,
      //"name": "Glitch Widget - "+genSub,
      "name" : display_name,
      "iss": process.env.ISS
    };
    //sign above payload
    var token = jwt.sign(
      payload,
      Buffer.from(process.env.SECRET, 'base64'),
      { expiresIn: '1h' }
    );
  
  // sanity output to the console 
  //console.log ("Payload - "+ JSON.stringify(payload));
  //console.log ("Token - "+ JSON.stringify(token));
  
  var dataobj = {
    token : token,
    label : genSub
  };
  // send back the token to whoever called this function
  return dataobj;

  };