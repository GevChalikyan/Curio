// Highlight hovered elements and log their type
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h *= 60;
    }
    return [ h, s * 100, l * 100 ];
  }
  
  document.addEventListener("mouseover", function (event) {
    const el = event.target;
    el.classList.add("hover-highlight"); 
    const style = window.getComputedStyle(el);
    const bg = style.backgroundColor;              
    const [r, g, b] = bg.match(/\d+/g).map(Number);
    let [h, s, l] = rgbToHsl(r, g, b);
  
    // darken by 20 points of lightness (clamp ≥0)
    l = Math.max(0, l - 20);
  
    const darker = `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;
    el.style.outline = `2px solid ${darker}`;
    el.style.borderRadius = "10px";                  
    el.style.transition = "outline 0.2s ease-in-out";
  
    // remove on mouseout
    el.addEventListener("mouseout", function cleanup() {
    el.classList.remove("hover-highlight"); 
      el.style.outline = "";
      el.style.borderRadius = "";  
      el.removeEventListener("mouseout", cleanup);
    });
    
  });

// Store the last right-clicked element
document.addEventListener("contextmenu", (event) => {
    window.lastRightClickedElement = event.target; // Save element for logging
    window.lastRightClickedTagName = event.target.tagName; // Save tag name for background.js
});
