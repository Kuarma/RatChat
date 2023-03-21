document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector('.chat-input input');
  const chat = document.querySelector('.chat-input button');
  const messages = document.querySelector('.chat-messages');

  const socket = new WebSocket('ws://localhost:8080');

  socket.addEventListener('open', function(event) {
    const messageElement = document.createElement("p");
    messageElement.textContent = event.data;
    messages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  button.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
function sendMessage() {
    const message = input.value.trim();
    if (message.length > 0) {
      socket.send(message);
      input.value = "";
    }
  }
});
