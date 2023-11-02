const socket = io();

socket.emit("user-Active", {
  email: window.sessionStorage.email,
});

socket.on("userAddedOrRemoved", (res) => {
  const activeUsers = document.getElementById("active-users");
  let msg = "";
  res.forEach((element) => {
    msg += `<button type="button" onclick="selectedUser('${element}')" id="${element}">${element}</botton>`;
  });
  activeUsers.innerHTML = msg + "</br>";
  console.log(res);
});
function selectedUser(sendTo) {
    document.getElementById("sendTo").innerHTML = sendTo;
}

socket.on("recievedMessage", (res) => {
  receiveMessage(res);
});

function sendMessage() {
  const message = document.getElementById("message").value;
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<span class="message sent">You:${message}</span>`;
  chatBox.appendChild(messageElement);
  document.getElementById("message").value = "";
  console.log(message);

  const sendTo = document.getElementById("sendTo").innerText;
  socket.emit("sendMessage", {
    senderEmail: window.sessionStorage.email,
    recieverEmail: sendTo,
    message: message,
  });
}

// Function to receive a message
function receiveMessage(sendInfo) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<span class="message received">${sendInfo.senderEmail}:${sendInfo.message}</span>`;
  chatBox.appendChild(messageElement);
}
