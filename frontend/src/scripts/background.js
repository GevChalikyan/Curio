chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);

  if (command === "toggle_element_selection_state") {
    console.log("Element Selection State Toggled");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_element_selection" });
        console.log("TEST");
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "logElementType",
    title: "Send to OpenRouter",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "logElementType") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        async function sendMessage(textOnlyContent) {
          const inputBox = document.getElementById('openrouter-input-area');
          const outputBox = document.getElementById('openrouter-output-area');
          const message = textOnlyContent;

          if (!message) return;

          outputBox.innerHTML += `<div style="margin-bottom: 10px;"><strong>You:</strong> ${message}</div>`;
          inputBox.value = '';
          outputBox.innerHTML += `<div><em>Thinking...</em></div>`;

          try {
            const res = await fetch('https://api-connection-pdoi.onrender.com/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ message })
            });

            const text = await res.text();

            try {
              const data = JSON.parse(text);
              const reply = data.reply || 'Error: No reply received';
              outputBox.innerHTML += `<div style="margin-bottom: 10px;"><strong>Bot:</strong> ${reply}</div>`;
            } catch (jsonError) {
              outputBox.innerHTML += `<div style="color: red;"><strong>Server Error Response:</strong><br><pre>${text}</pre></div>`;
            }

            outputBox.scrollTop = outputBox.scrollHeight;
          } catch (err) {
            outputBox.innerHTML += `<div style="color: red;"><strong>Network Error:</strong> ${err.message}</div>`;
          }
        }

        createPopup();

        if (window.lastRightClickedElement) {
          const element = window.lastRightClickedElement;
          const elementType = element.tagName;

          let textOnlyContent = '';
          if (elementType === "IMG") {
            textOnlyContent = `[Image: ${element.alt || element.src}]`;
          } else if (elementType === "INPUT" || elementType === "TEXTAREA") {
            textOnlyContent = element.value || '';
          } else if (elementType === "A") {
            textOnlyContent = element.textContent || element.href;
          } else {
            textOnlyContent = element.textContent || '';
          }

          textOnlyContent = textOnlyContent.trim();
          console.log("Element text content:", textOnlyContent);
          sendMessage(textOnlyContent);
        } else {
          console.log("No element recorded.");
        }
      }
    });
  }
});