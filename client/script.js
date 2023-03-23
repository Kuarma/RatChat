function toggleNav() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

// Function to show the message
function showmessage(isMine, text = false) {
    const theirs = 'theirs';
    const messageContainer = document.getElementById("message");
    const messageRow = document.createElement("div");
    messageRow.className = `message-row ${isMine ? 'mine' : theirs}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.backgroundColor = isMine ? "var(--message-send)" : "var(--message-recieve)";
    bubble.textContent = text;

    messageRow.appendChild(bubble);
    messageContainer.appendChild(messageRow);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const ws = new WebSocket("ws://localhost:3000");
ws.addEventListener('message', ev => {
    showmessage(false, ev.data);
});

document.querySelector('form').onsubmit = ev => {
    ev.preventDefault();
    const input = document.querySelector('input');
    ws.send(input.value);
    showmessage(true, input.value);
    input.value = '';
}

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
            window.location.href = "../chat/glimpse.html";
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
  