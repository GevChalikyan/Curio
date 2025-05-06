function sendMessage(textOnlyContent) {
  const inputBox = document.getElementById('openrouter-input-area');
  const outputBox = document.getElementById('openrouter-output-area');
  const message = "Expand on this but try to keep it to a paragraph: " + textOnlyContent;

  if (!message) return;

  outputBox.innerHTML += `<div style="margin-bottom: 10px;"><strong>You:</strong> ${textOnlyContent}</div>`;
  inputBox.value = '';
  outputBox.innerHTML += `<div><em>Thinking...</em></div>`;

  fetch('https://api-connection-pdoi.onrender.com/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  .then(res => res.text())
  .then(text => {
    try {
      const data = JSON.parse(text);
      const reply = data.reply || 'Error: No reply received';
      outputBox.innerHTML += `<div style="margin-bottom: 10px;"><strong>Bot:</strong> ${reply}</div>`;
    } catch (jsonError) {
      outputBox.innerHTML += `<div style="color: red;"><strong>Server Error Response:</strong><br><pre>${text}</pre></div>`;
    }
    outputBox.scrollTop = outputBox.scrollHeight;
  })
  .catch(err => {
    outputBox.innerHTML += `<div style="color: red;"><strong>Network Error:</strong> ${err.message}</div>`;
  });
}

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "SEND_MESSAGE") {
      sendMessage(event.data.text);
    }
  });