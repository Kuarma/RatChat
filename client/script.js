$(document).ready(function () {
    $("#register-form").on("submit", function (event) {
      event.preventDefault();
  
      let formData = {
        username: $("input[name='username']").val(),
        email: $("input[name='email']").val(),
        password: $("input[name='password']").val(),
      };

      $.ajax({
        type: "POST",
        url: "/api/Registration",
        data: JSON.stringify(formData),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
          if (response.message === "Registration successful") {
            alert("Registration successful! Redirecting to login page...");
            window.location.href = "../index.html";
          } else {
            alert(response.message);
          }
        },
        error: function (jqXHR) {
          alert("Error: " + jqXHR.responseJSON.message);
        },
      });
    });
  });

  $(document).ready(function () {
    $("#login-form").on("submit", function (event) {
      event.preventDefault();
  
      let formData = {
        username: $("input[name='username']").val(),
        password: $("input[name='password']").val(),
      };

      $.ajax({
        type: "POST",
        url: "/api/Login",
        data: JSON.stringify(formData),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
          if (response.message === "Login successful") {
            alert("Login successful! Redirecting to chat page...");
            window.location.href = "chat/glimpse.html";
            document.cookie = "username=" + formData.username;
          } else {
            alert(response.message + " Please try again.");
          }
        },
        error: function (jqXHR) {
          alert("Error: " + jqXHR.responseJSON.message);
        },
      });
    });
  });
  