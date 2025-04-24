// Create the right-click menu option
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
                async function sendToOpenRouter(message) {
                    message = "Expand on this: " + message;
                    console.log(message);
                    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer API_Key_Goes_Here"  // Put your API key here
                        },
                        body: JSON.stringify({
                            model: "deepseek/deepseek-chat-v3-0324:free",
                            messages: [{ role: "user", content: message }]
                        })
                    });

                    if (!response.ok) {
                        console.error(`Error: ${response.status} ${response.statusText}`);
                        return;
                    }

                    const data = await response.json();
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        console.log("OpenRouter response:", data.choices[0].message.content);
                    } else {
                        console.log("Unexpected response format.");
                    }
                }

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
                    sendToOpenRouter(textOnlyContent);
                } else {
                    console.log("No element recorded.");
                }
            }
        });
    }
});

