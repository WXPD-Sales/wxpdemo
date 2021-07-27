<p align="center">
  <h2 align="center"> Webex Guest Link Generator</h2>

  <p align="center">
    Demo showing the various ways a Webex Meeting can be joined as a Guest, or Licensed user, from the Webex Widget or Browser SDK.
    <br />
    <a href="https://wxsd.wbx.ninja/wxsd-guest-demo/linkgen"><strong>View Demo</strong></a>
    ·
    <a href="https://github.com/WXSD-Sales/wxpdemo/issues"><strong>Report Bug</strong></a>
    ·
    <a href="https://github.com/WXSD-Sales/wxpdemo/issues"><strong>Request Feature</strong></a>
  </p>
</p>

## About The Project

### Video Demo
[![Guest Link Generator Video Demo](https://img.youtube.com/vi/PI4Noo1S_nM/0.jpg)](https://youtu.be/PI4Noo1S_nM, "Guest Link Generator Video Demo")


### Built With

- Node v12.16.1 (npm v6.13.4)
- Webex JS SDK

<!-- GETTING STARTED -->


### Installation

1. Clone the repo
   ```sh
   git clone repo
   ```
2. Install the packages:
   ```sh
   npm install --save webex
   npm install dotenv
   npm install express
   npm install body-parser
   npm install jsonwebtoken
   npm install passport-auth0
   npm install pug
   ```

### Usage

1. You will need a file titled ".env" in the root directory that contains the following variables.
   Please note you will **need to replace most of these values with your own!**
2. ```
   GLITCH_DEBUGGER=true #Only required if you run this on glitch.me

   BASE_URL=https://1234.eu.ngrok.io
   MY_ROUTE="/wxsd-guest-demo"
   PORT=8910

   # Webex Oauth Integration
   # Create one here: https://developer.webex.com/my-apps/new (Select Integration)
   # The redirect_uri you enter for the integration should be the same as the BASE_URL variable from above
   WEBEX_AUTH_URL="https://webexapis.com/v1/authorize?client_id=C1234&response_type=code&redirect_uri=https%3A%2F%2F1234.eu.ngrok.io%2Fcreate_token&   scope=spark%3Aall%20spark%3Akms"
   WEBEX_AUTH_CLIENT=C1234
   WEBEX_AUTH_SECRET=5678
   
   # Webex Bot
   # Create one here: https://developer.webex.com/my-apps/new (Select Bot)
   WEBEX_ACCESS_TOKEN="NjZiYzU4ZDUtNWFhYy00NDQ4LTk2YjktZjcxNTBlZDk1ZGIyZDE3ODMzMTYtNmFj_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f"
   WEBEX_BOT_ID="Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNGNlYmZhNC1kM2VjLTRiZjctYjQ0My03ZjUyODNjMDY2MWY"

   #A Redis instance is required
   REDIS_CONN=':abcd@redis-19201.c12.us-east-1-2.ec2.cloud.redislabs.com:19201'

   # GUEST ISSUER for Persistent Guest tokens
   # Create one here: https://developer.webex.com/my-apps/new (Select Guest Issuer)
   ISS='ABCD'
   SECRET='C5678'
   
   # IMIMobile Flow for Guest SMS Authentication
   IMIHOOK="https://hooks-us.imiconnect.io/events/1234"
   IMISMS_RELAY="https://hooks-us.imiconnect.io/events/5678"
   ```
3. Once the .env file has been created, and the packages have been installed, run
   ```sh
   >$ node server.js
   ```

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact
Please contact us at wxsd@external.cisco.com
