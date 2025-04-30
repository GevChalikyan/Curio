chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);

  if (command === "toggle_element_selection_state") {
    console.log("Element Selection State Toggled");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if(tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_element_selection" });
        console.log("TEST");
      }
    });
  }
});