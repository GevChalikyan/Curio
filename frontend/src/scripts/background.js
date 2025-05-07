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
    title: "Send to Curio",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "logElementType") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
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

          window.postMessage({ type: "SEND_MESSAGE", text: textOnlyContent }, "*");
        } else {
          console.log("No element recorded.");
        }
      }
    });
  }
});

