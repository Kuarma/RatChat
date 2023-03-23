$(document).ready(function () {
    // Handle form submission for registration
    $("#register-form").on("submit", function (event) {
      event.preventDefault();
  
      // Collect form data
      let formData = {
        username: $("input[name='username']").val(),
        email: $("input[name='email']").val(),
        password: $("input[name='password']").val(),
      };

      // Send form data to backend API
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
    // Handle form submission for login
    $("#login-form").on("submit", function (event) {
      event.preventDefault();
  
      // Collect form data
      let formData = {
        email: $("input[name='email']").val(),
        password: $("input[name='password']").val(),
      };

      // Send form data to backend API
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
          } else {
            alert(response.message + " Redirecting to login page...");
          }
        },
        error: function (jqXHR) {
          alert("Error: " + jqXHR.responseJSON.message);
        },
      });
    });
  });
  