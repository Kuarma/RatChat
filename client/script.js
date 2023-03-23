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

async function handleSubmit(event, type) {
    event.preventDefault();
    const form = event.target;
  
    const email = form.email.value;
    const password = form.password.value;
    const username = type === 'register' ? form.username.value : '';
  
    const response = await fetch(`../server/api/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });
  
    const data = await response.json();
  
    if (response.status === 200) {
      localStorage.setItem('token', data.token);
      window.location.href = 'chat/glimpse.html';
    } else {
      alert(data.message);
    }
  }
