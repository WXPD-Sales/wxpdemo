const avatar = Cookies.get("avatar");

if(avatar != "undefined"){
  console.log('setting avatar');
  $('#user-avatar').attr("src", avatar);
}
