document.addEventListener("mouseover", function (event) {
    let target = event.target;

    // Add highlight class
    target.classList.add("hover-highlight");

    // Remove highlight when mouse leaves
    target.addEventListener("mouseout", function () {
        target.classList.remove("hover-highlight");
    }, { once: true }); // Ensures event runs only once per hover
});