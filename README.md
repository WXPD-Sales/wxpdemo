Node v12.16.1 (npm v6.13.4)

**Node Module Requirements**
npm install dotenv

npm install express

npm install body-parser

npm install jsonwebtoken

npm install passport-auth0

npm install pug


**Environment File**
You will need a file titled ".env" in the root directory that contains the following variables.  
Please note you will **need to replace most of these values with your own!**
```
GLITCH_DEBUGGER=true #Only required if you run this on glitch.me

BASE_URL=https://1234.eu.ngrok.io
PORT=8910

# Webex Oauth Integration
# Create one here: https://developer.webex.com/my-apps/new (Select Integration)
# The redirect_uri you enter for the integration should be the same as the BASE_URL variable from above
WEBEX_AUTH_URL="https://webexapis.com/v1/authorize?client_id=C1234&response_type=code&redirect_uri=https%3A%2F%2F1234.eu.ngrok.io%2Fcreate_token&scope=spark%3Aall%20spark%3Akms"
WEBEX_AUTH_CLIENT=C1234
WEBEX_AUTH_SECRET=5678

#A Redis instance is required
REDIS_CONN=':abcd@redis-19201.c12.us-east-1-2.ec2.cloud.redislabs.com:19201'

# GUEST ISSUER for Persistent Guest tokens
# Create one here: https://developer.webex.com/my-apps/new (Select Guest Issuer)
ISS='ABCD'
SECRET='C5678'

#AUTH0
#You can setup an Auth0 account here: https://auth0.com/
AUTH0_CLIENT_ID='P1234'
AUTH0_DOMAIN='dev-rd1p123x.us.auth0.com'
AUTH0_CLIENT_SECRET='_zABCD'
AUTH0_CALLBACK_URL='https://1234.eu.ngrok.io/callback' #This is BASE_URL + "/callback"
```

When you create a new Auth0 app, please use the following settings:
Application Type: **Regular Web Application**
Token Endpoint Authentication Method: **POST**
Application login uri: **BASE_URL + "/login"**
Application callback URLs: **BASE_URL + "/callback"**
Application logout uri: **BASE_URL + "/logout?returnTo=https%3A%2F%2Fwww.cisco.com, https://www.cisco.com"**
Allowed Web Origins: Your Auth0 domain, example: https://dev-rd1234p.us.auth0.com

Once all of the above is complete, you can run:
```node server.js```

