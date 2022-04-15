$(document).ready(function () {
    $("#registerForm").submit(function (event) {
        console.log("loging in...")
      var formDataRegister = {
        username: $("#username").val(),
        firsName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        password: $("#password").val(),
        phoneNumber: $("#phoneNumber").val(),
        emailAdress: $("#emailAdress").val(),
        adress: $("#adress").val(),
        postalCode: $("#postalCode").val(),
      };
  
      $.ajax({
        type: "POST",
        url: "/register",
        data: formDataRegister,
        dataType: "json",
        encode: true,
      }).done(function (data) {
        console.log(data);
      });
  
      event.preventDefault();
    });


    $("#loginForm").submit(function (event) {
        console.log("registering...")
        var formDataLogin = {
          username: $("#loginUsername").val(),
          password: $("#loginPassword").val(),
        };
    
        $.ajax({
          type: "POST",
          url: "/login",
          data: formDataLogin,
          dataType: "json",
          encode: true,
        }).done(function (data) {
          console.log(data);
        });
    
        event.preventDefault();
      });
  });

