(function applyGlobalVariables() {
  Array.from(document.body.querySelectorAll("[global-variables]")).map((el) => {
    const globalVariables =
      el.getAttribute("global-variables")?.split(" ") || [];
    document.body.classList.add(...globalVariables);
  });
})();
