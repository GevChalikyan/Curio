is_element_selection_active = false;

function element_selection_listener(event) {
  let target = event.target;

  target.classList.add("hover-highlight");

  target.addEventListener("mouseout", function () {
      target.classList.remove("hover-highlight");
  }, { once: true });
}

function toggle_element_selection() {
  if (isHighlighterActive) {
    document.addEventListener("mouseover", element_selection_listener);
    console.log("Element Selection Enabled");
  } else {
    document.removeEventListener("mouseover", element_selection_listener);
    console.log("Element Selection Disabled");
  }
  isHighlighterActive = !isHighlighterActive;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle_element_selection") {
    toggle_element_selection();
    sendResponse({ status: is_element_selection_active ? "Enabled" : "Disabled" });
  }
})