(function ($) {
    "use strict";

    $(document).ready(function() {
      $("#tel").focus();
    })
    /*==================================================================
    [ Validate ]*/
    function pressEnterTel(e){
      let btnId = "send_tel";
      pressEnter(e, btnId);
    }

    function pressEnterEmail(e){
      let btnId = "send_email";
      pressEnter(e, btnId);
    }


    function pressEnterCode(e){
      let btnId = "verify";
      pressEnter(e, btnId);
    }

    function pressEnter(e, btnId){
      var key = e.which;
      if(key ==13){
        $(`#${btnId}`).click();
        return false;
      }
    }

    function sendData(data){
      $("#part1").fadeOut(function(){
        console.log(data);
        fetch('/verify', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(function(data){
          console.log('response data:')
          console.log(data);
          $("#part2").fadeIn();
          $("#code").focus();
        })
      });
    }

    function clickButtonTel(e){
      var checkPassed = true;
      let input = $('#tel');
      let phoneNumber = $(input).val().trim();
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "");//remove anything that isn't a number
      let data = {phoneNumber:phoneNumber};
      if(phoneValidate(phoneNumber) == false){
          showAlert(input, "Valid phone number required.");
          checkPassed=false;
      }
      if(checkPassed){
        sendData(data)
      } 
      return checkPassed;
    }

    function clickButtonEmail(e){
      var checkPassed = true;
      let input = $('#email');
      let email = $(input).val().trim();
      let data = {email:email};
      if(emailValidate(email) === false){
          showAlert(input, "Valid email address required.");
          checkPassed=false;
      }
      if(checkPassed){
        sendData(data)
      } 
      return checkPassed;
    }

    function codeIsCorrectFormat(input){
      if($(input).val().trim().match(/[0-9]{4}/) != null){
        return true;
      }
      return false;
    }

    function clickButtonCode(e){
      var checkPassed = true;
      let input = $('#code');
      if( !codeIsCorrectFormat(input) ){
          showAlert(input, "Code is invalid.");
          checkPassed=false;
      }
      if(checkPassed){
        console.log('ok');
        let code = $(input).val().trim();
        console.log(code);
        fetch('/confirm', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({code:code}),
        })
        .then(response => response.json())
        .then(function(data){
          console.log('response data /code:')
          console.log(data);
          if(data.status == "success"){
            $("#part2").fadeOut();
            window.location.href = data.url;
          } else {
            showAlert(input, data.message);
          }
        })
      }
      return checkPassed;
    }

    $("#tel").keypress(pressEnterTel);
    $("#email").keypress(pressEnterEmail);
    $("#code").keypress(pressEnterCode);

    $('#send_tel').on('click',clickButtonTel);
    $('#send_email').on('click',clickButtonEmail);
    $('#verify').on('click',clickButtonCode);

    $("#restart").on('click', function(e){
      $("#part2").fadeOut(function(){
        $("#part1").fadeIn();
      })
    })


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideAlert(this);
        });
    });


    function showAlert(input, msg) {
      console.log('wrong')
      var thisAlert = $(input).parent();
      $(thisAlert).attr('data-validate', msg);
      $(thisAlert).addClass('alert-validate');
    }

    function hideAlert(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);
