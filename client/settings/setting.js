document.addEventListener("DOMContentLoaded", () => {
    const usernameForm = document.querySelector(".user-settings[name='username']");
    const usernameGreeting = document.querySelector(".greet-user");
  
    // Read JWT token from the cookie
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
  
    // Display the current username
    function displayUsername() {
      const token = getCookie("token");
      if (token) {
        const decoded = jwt_decode(token);
        usernameGreeting.textContent = `Hello ${decoded.username}`;
      }
    }
  
    // Change the username
    async function changeUsername(event) {
      event.preventDefault();
  
      const oldUsername = jwt_decode(getCookie("token")).username;
      const newUsername = event.target.elements.newusername.value;
  
      if (!newUsername) {
        alert("Please enter a new username.");
        return;
      }
  
      try {
        const response = await fetch("/api/changeName", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldUsername, newUsername }),
        });
        const data = await response.json();
  
        if (response.status === 200) {
          alert(data.message);
          const decoded = jwt_decode(getCookie("token"));
          decoded.username = newUsername;
          const token = createJWT(decoded.username);
          document.cookie = `token=${token};path=/;HttpOnly`;
          displayUsername();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while updating the username.");
      }
    }
  
    // Event listeners
    usernameForm.addEventListener("submit", changeUsername);
  
    // Initial display of the username
    displayUsername();
  });
  