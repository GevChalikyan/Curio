is_element_selection_active = false;

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [h, s * 100, l * 100];
}

function element_selection_listener(event) {
    const target = event.target;

    // Get background color and compute a darker outline
    const computedStyle = window.getComputedStyle(target);
    const bg = computedStyle.backgroundColor;
    const match = bg.match(/\d+/g);
    if (!match || match.length < 3) return;

    const [r, g, b] = match.map(Number);
    let [h, s, l] = rgbToHsl(r, g, b);
    l = Math.max(0, l - 20);
    const darker = `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;

    // Apply CSS class and dynamic outline
    target.classList.add("hover-highlight");
    target.style.outline = `2px solid ${darker}`;
    target.style.borderRadius = "10px";
    target.style.transition = "outline 0.2s ease-in-out";

    target.addEventListener("mouseout", function cleanup() {
        target.classList.remove("hover-highlight");
        target.style.outline = "";
        target.style.borderRadius = "";
        target.removeEventListener("mouseout", cleanup);
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
});

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