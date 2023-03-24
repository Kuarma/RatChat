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

async function fetchMessages() {
  try {
    const response = await fetch("/api/AllMessages");
    if (response.ok) {
      const messages = await response.json();
      for (const message of messages) {
        showmessage(
          message.user_name === getCookie("username"),
          message.user_name,
          message.message
        );
      }
    } else {
      console.error("Failed to fetch messages");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call fetchMessages when the page is loaded
fetchMessages();

const ws = new WebSocket("ws://localhost:3000");
ws.addEventListener("message", (ev) => {
  const data = JSON.parse(ev.data);
  showmessage(false, data.username, data.message);
});

document.querySelector("form").onsubmit = (ev) => {
  ev.preventDefault();
  const input = document.querySelector("input");
  const username = getCookie("username");
  const message = JSON.stringify({
    username: username,
    message: input.value,
  });
  ws.send(message);
};

function getUsernameFromToken() {
  const token = getCookie("token");
  if (!token) return "";

  try {
    const decodedToken = jwt_decode(token);
    return decodedToken.username;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return "";
  }
}

function sendMessage() {
  const inputField = document.querySelector(".input-chat");
  const message = inputField.value.trim();
  if (message === "") return;

  const username = getUsernameFromToken();
  if (!username) {
    alert("Username not found. Please set a valid username.");
    return;
  }

  ws.send(JSON.stringify({ username, message }));
  inputField.value = "";
}

function showmessage(isMine, username, text = false) {
  const theirs = "theirs";
  const messageContainer = document.getElementById("message");
  const messageRow = document.createElement("div");
  messageRow.className = `message-row ${isMine ? "mine" : theirs}`;

  // Add the username above the chat bubble
  const usernameLabel = document.createElement("div");
  usernameLabel.className = "username-label";
  usernameLabel.textContent = username;
  messageRow.appendChild(usernameLabel); // Append the username label to the message row

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.style.backgroundColor = isMine
    ? "var(--message-send)"
    : "var(--message-recieve)";
  bubble.textContent = text;

  messageRow.appendChild(bubble);
  messageContainer.appendChild(messageRow);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

const chatForm = document.querySelector("form");
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

function updateChat(message) {
  const messageContainer = document.getElementById("message");

  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");

  if (message.user_name === getUsernameFromToken()) {
    messageElement.classList.add("mine");
  } else {
    messageElement.classList.add("theirs");
  }

  messageElement.innerHTML = `
    <span class="chat-username">${message.user_name}</span>
    <span class="chat-text">${message.message}</span>
  `;

  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
