<p align="center">
  <h2 align="center"> Webex Guest Link Generator</h2>

  <p align="center">
    Demo showing the various ways a Webex Meeting can be joined as a Guest, or Licensed user, from the Webex Widget or Browser SDK.
    <br />
    <a href="https://wxsd.wbx.ninja/"><strong>View Demo</strong></a>
    ·
    <a href="https://github.com/WXSD-Sales/wxpdemo/issues"><strong>Report Bug</strong></a>
    ·
    <a href="https://github.com/WXSD-Sales/wxpdemo/issues"><strong>Request Feature</strong></a>
    .
    <a href="#quick_custom_demo"><strong>Quick Custom Demo</strong></a>
  </p>
</p>


## About The Project

### Video Demo
[![Guest Link Generator Video Demo](https://img.youtube.com/vi/PI4Noo1S_nM/0.jpg)](https://youtu.be/PI4Noo1S_nM, "Guest Link Generator Video Demo")

<!-- GETTING STARTED -->

## Generate Links

### Bot  
To generate links with a bot, start by sending a message to:  
wxsd-guest-demo@webex.bot

### This App  
To generate links with this app, <a href="https://wxsd.wbx.ninja/linkgen">click here</a> to get started.  
If unfiltered, the following links will be generated:  
<img src="https://user-images.githubusercontent.com/19175490/154356915-613664ee-0f32-40f6-9e66-852451dc4d6e.png" width="900"/>
  
Guest SDK  
Guest Widget  
Guest Embeddable  
  
Licensed SDK  
Licensed Widget  
Licensed Embeddable  

**Guest:**  
All of the "Guest" links (with the exception of Guest Embeddable), will require "Guest Authentication" to access the meeting session.  Webex Guests are not required to authenticate to join a meeting, however we've "protected" our demo with simple SMS verification, powered by imimobile.

**Licensed:**  
All of the "Licensed" link (with the exception of Licensed Embeddable), require Webex Authentication (using a Webex OAuth Integration) to access the meeting session.  Simply use your Webex credentials to sign in when prompted.  If your org uses SSO, then you may not need to fully sign in if you already have an active SSO session.

**SDK:**  
All of the SDK links (as well as the Embeddable links) take advantage of the Webex JS SDK to power the web page to join a meeting.  The SDK is a collection of functions that allow a developer to build an app that can join a meeting as an authenticated user, while allowing the developer to customize the look and feel of their web page, or keep their existing webpage UI, if they are adding meeting components to the page.

**Widget:**  
All of the Widget links use the CDN powered widgets to bring a prebuilt meeting component into a webpage with little work from the developer. The trade off to little upfront work of the app developer, is that this widget component has less cutomizability (primarily through toggling features), and the look and feel of the widget cannot be as easily changed.

**Embeddable:**
The Embeddable links are intended to be used inside of something like an iframe, or any component that is intended to be managed programmatically.  You can use url parameters to authenticate, and provide certain toggles and styling information in a consistent link, that will not manage any session expiration, so it will remain available.  
    
### Customization Options Diagram
<img src="https://user-images.githubusercontent.com/19175490/154361112-f98dd75a-854e-4a7a-b40a-b73ad8b1bf89.png" width="900"/>


## Setup

### Prerequisites & Dependencies: 

- Node v12.16.1 (npm v6.13.4)
- [Webex JS SDK](https://www.npmjs.com/package/webex)

## Installation

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

## Embeddable Links with Github Pages

### Widget

You can use this tool to build an embeddable link with a widget automatically:  
https://wxsd-sales.github.io/wxpdemo-link/#/?tab=widget  
If you want to learn how to build your own see below. 

You can access a dynamic widget (without proper authentication) by using either of these urls in your browser:  
https://wxsd.wbx.ninja/widget  
https://wxsd-sales.github.io/wxpdemo/public/widget.html  

The widget.html page accepts the following URL parameters:
| Parameter  | Required | Description |
| ------------- | ------------- | ------------- |
| destination | required | The email address, roomId, or SIP URI. |
| destinationType | required | "email", "spaceId", "sip" |
| token | required | The Webex Bearer token of the local user ([your token from the developer portal](https://developer.webex.com/docs/api/getting-started#accounts-and-authentication)) |
| label | optional | The email address, roomId, or SIP URI.  |
| backgroundImage | optional | The publicly accessible URL of a custom background image to use. |

All URL parameters must be properly URL encoded, for example:

**Valid:**  
https://wxsd.wbx.ninja/widget?destination=someone%40gmail.com&destinationType=email&token=ABCD-EFG_HIJK&backgroundImage=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1579546929518-9e396f3cc809%3Fixlib%3Drb-1.2.1%26ixid%3DMnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8%26w%3D1000%26q%3D80

**NOT Valid:** (because backgroundImage is not URL encoded)  
https://wxsd.wbx.ninja/widget?destination=someone@gmail.com&destinationType=email&token=ABCD-EFG_HIJK&backgroundImage=https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80


### SDK

You can use this tool to build an embeddable link with a widget automatically:  
https://wxsd-sales.github.io/wxpdemo-link/#/?tab=sdk  
If you want to learn how to build your own see below. 

You can access a dynamic SDK page (without proper authentication) by using either of these urls in your browser:  
https://wxsd.wbx.ninja/guest  
https://wxsd-sales.github.io/wxpdemo/public/guest.html  

The guest.html page accepts the following URL parameters:
| Parameter  | Required | Description |
| ------------- | ------------- | ------------- |
| destination | required | The email address, roomId, or SIP URI  |
| token | required | The Webex Bearer token of the local user ([your token from the developer portal](https://developer.webex.com/docs/api/getting-started#accounts-and-authentication)) |
| userType | optional | "guest" (if using a guest JWT. If using a developer or OAuth token, do not include this parameter.) |
| autoDial | optional | true/false - If true, SDK session page will immediately begin dialing the destination on finalizad page load. |
| autoUnmute | optional | true/false - If true, SDK session page will automatically unmute when requested to do so by meeting Host. |
| backgroundImage | optional | The publicly accessible URL of a custom background image to use. |
| embedSize | optional | if embedSize == "small" the self video video window will lock to the corner of the screen, instead of the corner of the remote video. |
| meetButtonColor | optional | a hex color string for the meet button(s) i.e. 0000ff for blue |
| headerToggle | optional | true/false - defaults to true - whether to display the header at the top of the page or not. |
| listenOnlyOption | optional | true/false - defaults to false - whether to display the listen Only meet button or not.  |
| selfView | optional | true/false - defaults to true - whether to display the self view video element. |
| shareOnlyOption | optional | true/false - defaults to false - to only receive and send shared screen  |
| showSMS | optional | true/false - defaults to false - whether to display the send guest link via SMS to guest button. |
| socketUrl | optional | public url string, defaults to soapbox.wbx.ninja. |
| sessionId | optional | the room on Soapbox to send websocket message payloads. |


All URL parameters must be properly URL encoded, for example:

**Valid:**  
https://wxsd.wbx.ninja/guest?destination=someone%2Btest%40gmail.com&token=ABCD-EFG_HIJK&backgroundImage=https%3A%2F%2Fcdn.glitch.me%2Fe8c2cec0-da34-46dc-bede-0e3e44f3b149%2Fuaflight.jpg%3Fv%3D1639499886494&headerToggle=false&listenOnlyOption=false&meetButtonColor=0000ff

**NOT Valid:** (because email address includes "+", but is not URL encoded, nor is backgroundImage)  
https://wxsd.wbx.ninja/guest?destination=someone+test@gmail.com&token=ABCD-EFG_HIJK&backgroundImage=https://cdn.glitch.me/e8c2cec0-da34-46dc-bede-0e3e44f3b149/uaflight.jpg?v=1639499886494&headerToggle=false&listenOnlyOption=false&meetButtonColor=0000ff

## API

A simple API is provided to generate links

### Create Links (/create_url)

The full production endpoint to create guest and licensed user access links for SDK, and Widget use is:  
POST https://wxsd.wbx.ninja/create_url

The Content-Type is expected to be in JSON format, with the following JSON object attributes:

| Parameter  | Required | Default | Description |
| ------------- | ------------- | ------------- | ------------- |
| sip_target | true | -- | String - The email address, roomId, or SIP URI. |
| expire_hours | true | -- | Positive Integer - number of hours the generated links should be valid. |
| auto_dial | false | false | Boolean - If true, SDK session page will immediately begin dialing on finalizad page load. |
| auto_unmute | false | false | Boolean - If true, SDK session page will automatically unmute when requested to do so by meeting Host. |
| background_url | false | "[/hero-seethrough1.webp](https://raw.githubusercontent.com/wxsd-sales/wxsd-guest-demo/main/public/images/hero-seethrough1.webp)" | String - The publicly accessible URL of a custom background image to use. |
| header_toggle | false | true | Boolean - If true, shows the header bar at the top of each session page for licensed and guest users. |
| listen_only_option | false | false | Boolean - If true, shows the "join in listen only mode" button. |
| meet_button_color | false | "24AB31" | String - a hex color string for the meet button(s) i.e. 0000ff for blue |
| self_view | false | true | Boolean - If true, shows the self view/local camera of the session user.  |
| show_email | false | false | Boolean - If true, shows the "send guest link via email" button on session page. |
| sms_button | false | false | Boolean - If true, shows the "send guest link via SMS" button on session page. |
| socket_url | false | "soapbox.wbx.ninja" | String - The socket server to send events like user waiting in lobby. |
| version | false | -- | Integer - Current working version is ```2```, and should be set to use the above parameters. |

#### Create Links Response

Responses for /create_url requests will be in the following format.  The order of Guest & Licensed user session urls in their respective arrays will not change.  The sessionId at the end of each returned url will be the same for each of the relevant links (embedded links do not have a sessionId).
```
{
    "result": "OK",
    "message": "Session Created",
    "urls": {
        "Guest": [
            "https://wxsd.wbx.ninja/guest/ABCD1234",
            "https://wxsd.wbx.ninja/guest-widget/ABCD1234",
            "https://wxsd.wbx.ninja/guest?destination=somecec.acecloud%40webex.com&userType=guest&headerToggle=false&token={JWT}&backgroundImage=https%3A%2F%2Fsomeimg.com%2F1234.jpg&listenOnlyOption=false&selfView=true&showSMS=true&autoDial=false&meetButtonColor=00FF00"
        ],
        "Licensed": [
            "https://wxsd.wbx.ninja/licensed/ABCD1234",
            "https://wxsd.wbx.ninja/licensed-widget/ABCD1234",
            "https://wxsd.wbx.ninja/guest?destination=somecec.acecloud%40webex.com&userType=licensed&headerToggle=false&token={TOKEN}&backgroundImage=https%3A%2F%2Fsomeimg.com%2F1234.jpg&listenOnlyOption=false&selfView=true&showSMS=true&autoDial=false&meetButtonColor=00FF00"
        ]
    },
    "expires": "in 8 hours"
}
```

## Soapbox Connection

The SDK session pages will connect to Soapbox by default for both Guest and Licensed Users.  These session pages will use the sessionId as the Soapbox connection room.  For example, if the sessionId of the Links generated is "ABCD1234", you can use socket.io to connect to soapbox using the same sessionId, using either of the below methods:
```
var socket = io({query:`room=ABCD1234`});
```
```
socket.emit('join', 'ABCD1234');
```

The SDK session pages currently emit messages to Soapbox for 3 SDK events:  
[meeting:self:lobbyWaiting](https://webex.github.io/webex-js-sdk/api/#meetingeventmeetingselflobbywaiting)  
```
{"room":sessionId, "data":{"event":"lobby-waiting", "payload":payload.payload}}
```
[members:update](https://webex.github.io/webex-js-sdk/api/#memberseventmembersupdate)  
```
{"room":sessionId, "data":{"event":"members-update", "payload":payload.delta}}
```
[meeting:stateChange](https://webex.github.io/webex-js-sdk/api/#meetingeventmeetingstatechange)  
```
{"room":sessionId, "data":{"event":"meeting-state-change", "payload":payload.payload}}
```

## License
All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer
<!-- Keep the following here -->  
 Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex usecases, but are not Official Cisco Webex Branded demos.
<!-- CONTACT -->

## Contact
Please contact us at wxsd@external.cisco.com
