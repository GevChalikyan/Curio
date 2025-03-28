// Highlight hovered elements and log their type
document.addEventListener("mouseover", function (event) {
    let target = event.target;

    let elementType = "Unknown";
    if (target.tagName === "IMG") {
        elementType = "Image";
    } 
    else if (target.tagName === "P" || target.tagName === "DIV") {
        elementType = "Text";
    } 
    else if (target.tagName === "A") {
        elementType = "Link";
    } 
    else if (target.tagName === "BUTTON") {
        elementType = "Button";
    } 
    else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        elementType = "Input Field";
    }

    // Logs element type in console
    //console.log(`Hovered element type: ${elementType}`);

    // Add highlight class
    target.classList.add("hover-highlight");

    // Remove highlight when mouse leaves
    target.addEventListener("mouseout", function () {
        target.classList.remove("hover-highlight");
    }, { once: true }); // Ensures event runs only once per hover
});

// Store the last right-clicked element
document.addEventListener("contextmenu", (event) => {
    window.lastRightClickedElement = event.target; // Save element for logging
    window.lastRightClickedTagName = event.target.tagName; // Save tag name for background.js
});