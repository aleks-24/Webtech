$(document).ready(function () {
    $("#registerForm").submit(function (event) {
        console.log("logging in...")
      var formDataRegister = {
        username: $("#username").val(),
        firstname: $("#firstName").val(),
        lastname: $("#lastName").val(),
        password: $("#password").val(),
        phonenumber: $("#phoneNumber").val(),
        email: $("#emailAddress").val(),
        address: $("#address").val(),
        postcode: $("#postalCode").val(),
      };
  
      $.ajax({
        type: "POST",
        url: "/api/user",
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
          url: "/api/auth",
          data: formDataLogin,
          dataType: "json",
          encode: true,
        }).done(function (data) {
          console.log(data);
        });
    
        event.preventDefault();
      });
  });

