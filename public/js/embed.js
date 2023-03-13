const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sessionId       = urlParams.get('sessionId') == null ? Cookies.get("session_id") : urlParams.get('sessionId');
let deployUrl         = urlParams.get('deployUrl') == null ? 'https://wxsd.wbx.ninja/wxsd-guest-demo/' : urlParams.get('deployUrl');
const userType        = urlParams.get('userType') == null ? Cookies.get("userType") : urlParams.get('userType');
const destination     = urlParams.get('destination') == null ? Cookies.get("sip_target") : urlParams.get('destination');
const token           = urlParams.get('token') == null ? Cookies.get("token") : urlParams.get('token');
const backgroundImage = urlParams.get('backgroundImage') == null ? Cookies.get("backgroundImage") : urlParams.get('backgroundImage');
let headerToggle      = urlParams.get('headerToggle') == null ? Cookies.get("header_toggle") : urlParams.get('headerToggle');
let listenOnlyOption  = urlParams.get('listenOnlyOption') == null ? Cookies.get("listen_only_option") : urlParams.get('listenOnlyOption');
let shareOnlyOption   = urlParams.get('shareOnlyOption') == null ? Cookies.get("share_only_option") : urlParams.get('shareOnlyOption');
const meetButtonColor = urlParams.get('meetButtonColor') == null ? Cookies.get("meetButtonColor") : urlParams.get('meetButtonColor');
let selfView          = urlParams.get('selfView') == null ? Cookies.get("self_view") : urlParams.get('selfView');
let showSMS           = urlParams.get('showSMS') == null ? Cookies.get("sms_button") : urlParams.get('showSMS');
let showEmail         = urlParams.get('showEmail') == null ? Cookies.get("show_email") : urlParams.get('showEmail');
let urlShowSMS        = false;
let rootUrl           = Cookies.get("rootUrl");

let autoDial          = urlParams.get('autoDial') == null ? Cookies.get("auto_dial") : urlParams.get('autoDial');
let socketUrl         = urlParams.get('socketUrl') == null ? Cookies.get("socket_url") : urlParams.get('socketUrl');

const embedSize       = urlParams.get('embedSize');

let selectedLink = null;

if(deployUrl.endsWith('/')){
  deployUrl = deployUrl;
}

if(headerToggle !== undefined){
  headerToggle = headerToggle.toLowerCase() == "true";
} else {
  headerToggle = true;
}

if(listenOnlyOption !== undefined){
  listenOnlyOption = listenOnlyOption.toLowerCase() == "true";
} else {
  listenOnlyOption = false;
}

if(shareOnlyOption !== undefined){
  shareOnlyOption = shareOnlyOption.toLowerCase() == "true";
} else {
  shareOnlyOption = false;
}

if(selfView !== undefined){
  selfView = selfView.toLowerCase() == "true";
} else {
  selfView = true;
}

if(showEmail !== undefined){
  showEmail = showEmail.toLowerCase() == "true";
} else {
  showEmail = false;
}

if(showSMS !== undefined ){
  showSMS = showSMS.toLowerCase() == "true";
} else {
  showSMS = false;
}

if(autoDial !== undefined){
  autoDial = autoDial.toLowerCase() == "true";
} else {
  autoDial = false;
}

/*
try{
  urlShowSMS = urlParams.get('showSMS').toLowerCase() == "true";
} catch (e){}
*/
/*The functions in this file only apply to the embedded version of the page (i.e. ...io/guest.html?destination=etc )*/

function concatUrl(concat) {
    let useConcat = concat;
    if(concat.startsWith('/')){
        useConcat = concat.substring(1);
    }
    return deployUrl + "/" + useConcat;
}

function create_guest_data_object(){
    let guest_data = {};
    console.log(guest_data);
    guest_data.sip_target = destination;
    guest_data.background_url = backgroundImage;
    guest_data.header_toggle = headerToggle;
    guest_data.listen_only_option = listenOnlyOption;
    guest_data.share_only_option = shareOnlyOption;
    guest_data.meet_button_color = meetButtonColor;
    guest_data.expire_hours = 6;
    guest_data.skip_validation = true;
    return guest_data;
  };
  
  
  let guestUrl = null;
  async function create_url(){
    if(guestUrl === null){
        $('#sms').prop('disabled',true);
        try{
            let guest_data = create_guest_data_object();
            //console.log(concatUrl(deployUrl, '/create_url'))
            let createUrl = concatUrl('/create_url');
            let res = await fetch(createUrl, {
                method: 'POST',
                //credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(guest_data),
            });
            let jres = await res.json();
            console.log(jres);
            guestUrl = jres.urls["Guest"][0];
        } catch (e){
            console.log('create_url error:');
            console.log(e);
        }
        $('#sms').prop('disabled',false);
    }
    return guestUrl;
  };