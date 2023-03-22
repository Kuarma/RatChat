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
  document.getElementById("message").innerHTML += `
      <div class="message-row ${isMine ? 'mine' : theirs}">
          <div class="bubble">${text}</div>
      </div>
  `;
}

// Function to send the message

const ws = new WebSocket("ws://localhost:3000");
ws.addEventListener('message', ev => {
  ev.data.text().then(showmessage);
});

document.querySelector('form').onsubmit = ev => {
  ev.preventDefault();
  const input = document.querySelector('input');
  ws.send(input.value);
  showmessage(input.value, true)
  input.value = '';
}
