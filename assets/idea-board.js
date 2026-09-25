(() => {
  const form = document.getElementById("preview-form");
  if (!form) return;

  const input = document.getElementById("preview-title");
  const list = document.getElementById("preview-ideas");
  const status = document.getElementById("preview-status");
  const reset = document.getElementById("preview-reset");
  const key = "hth-idea-board-v1";
  const initial = ["Campus food map", "Study buddy finder"];
  const limit = 30;
  let ideas = [...initial];
  let persistent = true;

  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(stored) && stored.length <= limit && stored.every(
      (title) => typeof title === "string" && title.trim().length > 0 && title.length <= 120
    )) ideas = stored;
  } catch {
    // A malformed saved value should never stop the presentation.
  }

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(ideas));
      persistent = true;
    } catch {
      persistent = false;
    }
  }

  function render() {
    list.replaceChildren(...ideas.map((title) => {
      const item = document.createElement("li");
      item.textContent = title;
      return item;
    }));
  }

  function savedMessage(prefix = "") {
    status.textContent = prefix + (persistent ? "Saved in this browser" : "This session only");
  }

  input.addEventListener("input", () => input.setCustomValidity(""));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title || title.length > 120) {
      input.setCustomValidity("Add an idea between 1 and 120 characters.");
      input.reportValidity();
      return;
    }
    if (ideas.length >= limit) {
      status.textContent = "Board full. Reset to start again.";
      return;
    }
    ideas.unshift(title);
    save();
    render();
    list.scrollTop = 0;
    input.value = "";
    savedMessage("Added · ");
    input.focus();
  });

  reset.addEventListener("click", () => {
    ideas = [...initial];
    save();
    render();
    input.value = "";
    input.setCustomValidity("");
    savedMessage("Reset · ");
    input.focus();
  });

  save();
  render();
  savedMessage();
})();
