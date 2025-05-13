async function sendMessage(textOnlyContent, chatHistory) {

  createPopup();

  const inputBox = document.getElementById('openrouter-input-area');
  const outputBox = document.getElementById('openrouter-output-area');
  const thinkingMessage = document.createElement('div');
  thinkingMessage.innerHTML = '<em>Thinking…</em>';

  console.log(chatHistory);
  if (chatHistory){
    message = chatHistory + "\n" + textOnlyContent + "\n(keep it to a paragraph)";
  }else{
    message = "Expand on this but try to keep it to a paragraph: " + textOnlyContent;
  }
  console.log(message);

  if (!message) return;

  outputBox.innerHTML += `<div style="margin-bottom: 10px;"><strong>You:</strong> ${textOnlyContent}</div>`;
  inputBox.value = '';
  outputBox.appendChild(thinkingMessage);

  const { jwtToken: token } = await chrome.storage.local.get('jwtToken');

  await fetch('https://api-connection-pdoi.onrender.com/api/chat', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  })
  .then(res => res.text())
  .then(text => {
    try {
      const data = JSON.parse(text);
      thinkingMessage.remove();
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
    sendMessage(event.data.text, event.data.history);
  }
});