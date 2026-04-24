
function toggleMenu() {
      document.getElementById("navLeft").classList.toggle("show");
      document.getElementById("navRight").classList.toggle("show");
    }

const buttons = document.querySelectorAll(".box-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;

    // Toggle active class
    btn.classList.toggle("active");

    // Change arrow direction
    if (btn.classList.contains("active")) {
      btn.textContent = btn.textContent.replace("▼", "▲");
    } else {
      btn.textContent = btn.textContent.replace("▲", "▼");
    }

    // Toggle accordion content
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.style.paddingTop = 0;
      content.style.paddingBottom = 0;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.paddingTop = "15px";
      content.style.paddingBottom = "15px";
    }
  });
});




function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (text !== "") {
    const chatMessages = document.getElementById("chatMessages");

    // User message
    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.innerText = text;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    input.value = "";

    // Simulated support reply
    setTimeout(() => {
      const supportMsg = document.createElement("div");
      supportMsg.classList.add("message", "support");
      supportMsg.innerText = "Thanks for reaching out! We'll reply soon.";
      chatMessages.appendChild(supportMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
  }
}

