document.addEventListener("contextmenu", (event) => {
  window.lastRightClickedElement = event.target;
  window.lastRightClickedTagName = event.target.tagName;
});

function createPopup() {
  // Only create the popup if it doesn't already exist
  if (document.getElementById('openrouter-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'openrouter-popup';
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.width = '600px';  // Increased width (doubled size)
  popup.style.height = '600px';  // Increased height (doubled size)
  popup.style.backgroundColor = '#343541';
  popup.style.padding = '16px';
  popup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
  popup.style.borderRadius = '12px';
  popup.style.zIndex = '9999';
  popup.style.fontFamily = 'system-ui, sans-serif';
  popup.style.fontSize = '14px';
  popup.style.color = '#ECECF1';
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.boxSizing = 'border-box';
  popup.style.overflow = 'hidden';  // Prevent overflow

  // Make the popup draggable
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  popup.addEventListener('mousedown', (e) => {
      if (e.target !== popup) return; // Only allow dragging when clicking on the popup itself
      isDragging = true;
      offsetX = e.clientX - popup.getBoundingClientRect().left;
      offsetY = e.clientY - popup.getBoundingClientRect().top;
      popup.style.transition = 'none'; // Disable transition while dragging
  });

  window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const left = e.clientX - offsetX;
      const top = e.clientY - offsetY;
      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
  });

  window.addEventListener('mouseup', () => {
      isDragging = false;
      popup.style.transition = 'top 0.2s ease, left 0.2s ease'; // Re-enable transition after dragging
  });

  // Top input area (fixed height)
  const inputArea = document.createElement('textarea');
  inputArea.id = 'openrouter-input-area';
  inputArea.placeholder = 'Type your message here...';
  inputArea.style.width = '100%';
  inputArea.style.height = '60px';  // Fixed height for the input area
  inputArea.style.padding = '10px';
  inputArea.style.borderRadius = '8px';
  inputArea.style.border = '1px solid #555';
  inputArea.style.backgroundColor = '#40414F';
  inputArea.style.color = '#ECECF1';
  inputArea.style.outline = 'none';
  inputArea.style.fontSize = '14px';
  inputArea.style.boxSizing = 'border-box';
  inputArea.style.marginBottom = '12px';  // Space between input area and output area

  // Bottom output area (scrollable)
  const outputArea = document.createElement('div');
  outputArea.id = 'openrouter-output-area';
  outputArea.style.flex = '1';
  outputArea.style.overflowY = 'auto';  // Make this area scrollable
  outputArea.style.padding = '10px';
  outputArea.style.borderRadius = '8px';
  outputArea.style.border = '1px solid #555';
  outputArea.style.backgroundColor = '#2E3138';
  outputArea.style.color = '#ECECF1';
  outputArea.style.fontSize = '14px';
  outputArea.style.whiteSpace = 'pre-wrap';  // Preserve formatting
  outputArea.style.wordWrap = 'break-word';  // Handle long words that overflow
  outputArea.style.height = '450px';  // Fixed height for output area (adjusted)
  outputArea.style.overflow = 'auto';  // Allow scrolling when content exceeds

  // Close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '✖';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = '#A9A9B3';
  closeButton.style.fontSize = '18px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.alignSelf = 'flex-end';
  closeButton.style.marginTop = '8px';
  closeButton.style.transition = 'color 0.2s';

  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.color = '#F5F5F5';
  });
  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.color = '#A9A9B3';
  });
  closeButton.addEventListener('click', () => {
    popup.remove();
  });

  inputArea.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const message = inputArea.value.trim();
      const history = outputArea.textContent;
      if (message) {
        // Send the message to the content script using postMessage
        window.postMessage({ type: "SEND_MESSAGE", text: message, history: history }, "*");
      }
    }
  });

  popup.appendChild(inputArea);
  popup.appendChild(outputArea);
  popup.appendChild(closeButton);
  document.body.appendChild(popup);
}