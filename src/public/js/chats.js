const socket = io();

let user;
const chatbox = document.getElementById("chatbox");
let log = document.getElementById("log");

socket.on("allMessages", (messages) => {
  messages.forEach((message) => {
    log.innerHTML += `<p>${message.email} dice ${message.message}</p>`;
  });
});

fetch("/api/sessions/current")
  .then((response) => response.json())
  .then((data) => {
    user = data;
    socket.emit("auth", user);
  });

chatbox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      console.log("USER", user);
      socket.emit("message", {
        email: user.payload.email,
        message: chatbox.value,
      });
      chatbox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  log.innerHTML += `${data.email} dice ${data.message} <br>`;
});
