chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);

  if (command === "Element_Selection_State") {
    console.log("Element Selection State Enabled");
  }
});