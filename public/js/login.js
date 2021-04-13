(function ($) {
    "use strict";

    $(document).ready(function() {
      $("#tel").focus();
    })
    /*==================================================================
    [ Validate ]*/
    function pressEnterTel(e){
      let btnId = "send";
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

    function clickButtonTel(e){
      let btnId = "send";
      let input = $("#tel");
      clickButton(btnId, input);
    }

    function clickButtonCode(e){
      let btnId = "verify";
      let input = $("#code");
      clickButton(btnId, input);
    }

    function clickButton(btnId, input){
        var check = true;
        if(validate(input) == false){
            let msg = "Code is invalid";
            if(btnId == "send"){
              msg = "Valid Phone Number required";
            }
            showValidate(input, msg);
            check=false;
        }
        if(check && btnId == "send"){
          $("#part1").fadeOut(function(){
            let phoneNumber = $(input).val().trim();
            phoneNumber = phoneNumber.replace(/[^0-9]/g, "");//remove anything that isn't a number
            console.log(phoneNumber);
            $.post("/verify", {"phoneNumber": phoneNumber}, function(data){
              console.log('response data:')
              console.log(data);
              $("#part2").fadeIn();
              $("#code").focus();
            });
          });
        } else if(check && btnId == "verify"){
          console.log(check)
          console.log('ok');
          let code = $(input).val().trim();
          console.log(code);
          $.post(`/confirm`, {"code":code}, function(data){
            console.log('response data /code:')
            console.log(data);
            if(data.status == "success"){
              $("#part2").fadeOut();
              window.location.href = data.url;
            } else {
              showValidate(input, data.message);
            }
          });
        }
        return check;
    }

    $("#tel").keypress(pressEnterTel);
    $("#code").keypress(pressEnterCode);

    $('#send').on('click',clickButtonTel);
    $('#verify').on('click',clickButtonCode);

    $("#restart").on('click', function(e){
      $("#part2").fadeOut(function(){
        $("#part1").fadeIn();
      })
    })


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('id') == 'tel') {
            if($(input).val().trim().match(/^((\+1)?[\s-]?)?\(?[1-9]\d\d\)?[\s-]?[1-9]\d\d[\s-]?\d\d\d\d/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim().match(/[0-9]{4}/) == null){
                return false;
            }
        }
    }

    function showValidate(input, msg) {
        console.log('wrong')
        var thisAlert = $(input).parent();
        $(thisAlert).attr('data-validate', msg);
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);
