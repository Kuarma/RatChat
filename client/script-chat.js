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
      console.log("Fetched messages:", messages);

      const currentUser = getUsernameFromToken();
      for (const message of messages) {
        showmessage(
          message.user_name === currentUser,
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

function getCookie(name) {
  const cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

fetchMessages();

const ws = new WebSocket("ws://localhost:3000");
ws.addEventListener("message", (ev) => {
  console.log('WebSocket received message:', ev.data);
  const data = JSON.parse(ev.data);
  showmessage(data.username === getUsernameFromToken(), data.username, data.message);
});

function getUsernameFromToken() {
  const token = getCookie("username");
  if (!token) return "";

  try {
    const decodedToken = jwt_decode(token);
    console.log("Decoded token:", decodedToken);
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

  const username = getCookie("username");
  if (!username) {
    alert("Username not found. Please set a valid username.");
    return;
  }

  const messageData = JSON.stringify({ username, message });
  console.log('WebSocket sending message:', messageData); // Add console log
  ws.send(messageData);

  showmessage(username === getUsernameFromToken(), username, message);

  inputField.value = "";
}

function showmessage(isMine, username, text, isCurrentUser = false) {
  const theirs = "theirs";
  const messageContainer = document.getElementById("message");
  const messageRow = document.createElement("div");
  messageRow.className = `message-row ${isMine ? "mine" : theirs} ${isCurrentUser ? "current-user" : ""}`;

  const usernameLabel = document.createElement("div");
  usernameLabel.className = "username-label";
  usernameLabel.textContent = username;
  messageRow.appendChild(usernameLabel);

  if (text) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.backgroundColor = isMine
      ? "var(--message-send)"
      : "var(--message-recieve)";
    bubble.textContent = text;
    messageRow.appendChild(bubble);
  }

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

  if (message.user_name === getCookie("username")) {
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