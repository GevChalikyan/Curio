is_element_selection_active = false;

function element_selection_listener(event) {
  let target = event.target;

  target.classList.add("hover-highlight");

  target.addEventListener("mouseout", function () {
      target.classList.remove("hover-highlight");
  }, { once: true });
}

function toggle_element_selection() {
  if (!is_element_selection_active) {
    document.addEventListener("mouseover", element_selection_listener);
    console.log("Element Selection Enabled");
    curio_status("Curio Activated");
  } else {
    document.removeEventListener("mouseover", element_selection_listener);
    console.log("Element Selection Disabled");
    curio_status("Curio Deactivated");
  }
  is_element_selection_active = !is_element_selection_active;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle_element_selection") {
    toggle_element_selection();
    sendResponse({ status: is_element_selection_active ? "Enabled" : "Disabled" });
  }
})

function curio_status(message) {
  const existing = document.getElementById("curio-popup");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "curio-popup";
  toast.className = "curio-popup"; 
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}