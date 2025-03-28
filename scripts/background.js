chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);

  if (command === "toggle_element_selection_state") {
    console.log("Element Selection State Enabled");
  }
});