const slides = Array.from(document.querySelectorAll(".slide"));
const notes = document.getElementById("notes");
let current = Number.parseInt(location.hash.slice(1), 10) - 1;
if (!Number.isFinite(current) || current < 0 || current >= slides.length) current = 0;

slides.forEach((slide, index) => {
  const resource = document.createElement("a");
  resource.className = "slide-resource";
  resource.href = slide.dataset.resourceUrl || "./resources.html";
  resource.target = "_blank";
  resource.rel = "noopener noreferrer";
  resource.setAttribute("aria-label", `Resource for ${slide.dataset.title}`);
  resource.textContent = "↗";
  slide.append(resource);

  const actions = document.createElement("nav");
  actions.className = "slide-actions";
  actions.setAttribute("aria-label", "Slide controls");
  actions.innerHTML = `<button type="button" data-nav="prev" aria-label="Previous slide">←</button><button type="button" data-nav="notes" aria-label="Presenter notes">i</button><button type="button" data-nav="next" aria-label="Next slide">→</button>`;
  slide.append(actions);

  const progress = document.createElement("div");
  progress.className = "progress";
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  slide.append(progress);
});

function fit() {
  document.documentElement.style.setProperty("--scale", String(Math.min(innerWidth / 1280, innerHeight / 720)));
}

function show(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
  const note = slides[current].querySelector(".speaker-note");
  notes.innerHTML = `<button id="notes-close" type="button" aria-label="Close presenter notes">Close</button><h2>${slides[current].dataset.title}</h2>${note.innerHTML}`;
  location.hash = String(current + 1);
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-nav]")?.dataset.nav;
  if (action === "prev") show(current - 1);
  if (action === "next") show(current + 1);
  if (action === "notes") notes.classList.toggle("open");
  if (event.target.id === "notes-close") notes.classList.remove("open");
});

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); show(current + 1); }
  if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); show(current - 1); }
  if (event.key === "Home") show(0);
  if (event.key === "End") show(slides.length - 1);
  if (event.key.toLowerCase() === "n") notes.classList.toggle("open");
  if (event.key.toLowerCase() === "r") slides[current].querySelector(".slide-resource")?.click();
  if (event.key.toLowerCase() === "f") {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }
  if (event.key.toLowerCase() === "p") window.print();
  if (event.key === "Escape") notes.classList.remove("open");
});

let touchX = null;
document.getElementById("stage").addEventListener("touchstart", (event) => { touchX = event.changedTouches[0].clientX; }, { passive: true });
document.getElementById("stage").addEventListener("touchend", (event) => {
  if (touchX == null) return;
  const delta = event.changedTouches[0].clientX - touchX;
  if (Math.abs(delta) > 60) show(current + (delta < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

addEventListener("resize", fit);
addEventListener("hashchange", () => {
  const index = Number.parseInt(location.hash.slice(1), 10) - 1;
  if (Number.isFinite(index) && index !== current) show(index);
});
fit();
show(current);
