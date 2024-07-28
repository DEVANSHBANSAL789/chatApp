const socket = io("http://localhost:8000");
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio("ting.mp3");

// Function to append messages to the chat container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Handle form submission: send a message and clear the input field
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

// Prompt the user for their name and emit a "new-user-joined" event
const name1 = prompt("Enter your name to join");
socket.emit("new-user-joined", name1);

// Listen for "user-joined" events and append a message to the container
socket.on("user-joined", (name) => {
  append(`${name}: joined the chat`, "right");
});

// Listen for "receive" events and append a message to the container
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// Listen for "left" events and append a message to the container
socket.on("left", (name) => {
  append(`${name}: left the chat`, "right");
});
