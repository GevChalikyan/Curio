// Create the right-click menu option
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "logElementType",
        title: "Log Element Type and Content",
        contexts: ["all"] // Show this option on right-click anywhere
    });
});

// Listen for right-click menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "logElementType") {
        // Inject script into the page to log the element type and contents
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: logElementDetails
        });
    }
});

// Function to log element type and content
function logElementDetails() {
    if (window.lastRightClickedElement) {
        const element = window.lastRightClickedElement;
        const elementType = element.tagName;

        let elementContent = '';
        
        // Check if it's a text-based element
        if (elementType === "IMG") {
            elementContent = `Image source: ${element.src}`;
        } else if (elementType === "INPUT" || elementType === "TEXTAREA") {
            elementContent = `Input value: ${element.value}`;
        } else if (elementType === "A") {
            elementContent = `Link href: ${element.href}`;
        } else {
            // For other elements, use innerText or innerHTML
            elementContent = element.innerText || element.innerHTML;
        }

        // Log element type and content
        console.log("Right-clicked element type:", elementType);
        console.log("Element content:", elementContent);
    } else {
        console.log("No element recorded.");
    }
}