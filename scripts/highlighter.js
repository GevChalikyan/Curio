document.addEventListener("mouseover", function (event) {
  let target = event.target;

  target.classList.add("hover-highlight");

  target.addEventListener("mouseout", function () {
      target.classList.remove("hover-highlight");
  }, { once: true });
});