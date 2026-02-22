const messages = [
  {
    label: "HEYYYYYY...",
    text:  "Some things take time.",
    sub:   "I know, but it will be appreciated to tell if you're busy",
    theme: 0,
    glow:  "#5b3080"
  },
  {
    label: "Not to Impose just to Inform",
    text:  "Small text are also appreciated",
    sub:   "Always have been. from what i've seen",
    theme: 1,
    glow:  "#c9608a"
  },
  {
    label: "Emoji works too",
    text:  "Even small steps count.",
    sub:   "😀😃😄😁😆😅😂🤣",
    theme: 2,
    glow:  "#5561b8"
  },
  {
    label: "Feel",
    text:  "Be Direct",
    sub:   "Part of progress.",
    theme: 3,
    glow:  "#5b3080"
  },
  {
    label: "My thoughts",
    text:  "Just wanted it to be ",
    sub:   "Make it mean something.",
    theme: 4,
    glow:  "#c9608a"
  }
];


const msgBox    = document.getElementById("message");
const labelEl   = document.getElementById("label");
const textEl    = document.getElementById("text");
const subEl     = document.getElementById("sub");
const glowEl    = document.getElementById("glow");
const dotsEl    = document.getElementById("dots");
const nextBtn   = document.getElementById("nextBtn");
const endMsg    = document.getElementById("endMsg");
const replayBtn = document.getElementById("replayBtn");
const slideNum  = document.getElementById("slideNum");

let current = 0;
const total = messages.length;
let transitioning = false;

/* ── DOTS ── */
function buildDots() {
  dotsEl.innerHTML = "";
  messages.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    dotsEl.appendChild(d);
  });
}

function updateDot(index) {
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

/* ── SHOW ── */
function showMessage(index) {
  const m = messages[index];
  document.body.className  = "theme-" + m.theme;
  glowEl.style.background  = m.glow;
  labelEl.textContent      = m.label;
  textEl.textContent       = m.text;
  subEl.textContent        = m.sub;
  slideNum.textContent     = "0" + (index + 1) + " / 0" + total;
  updateDot(index);

  msgBox.classList.remove("visible", "hidden");
  void msgBox.offsetWidth;
  msgBox.classList.add("visible");
}

/* ── HIDE ── */
function hideMessage(callback) {
  if (transitioning) return;
  transitioning = true;
  msgBox.classList.remove("visible");
  msgBox.classList.add("hidden");
  setTimeout(() => {
    msgBox.classList.remove("hidden");
    callback();
    transitioning = false;
  }, 950);
}

/* ── ADVANCE ── */
function advance() {
  if (transitioning) return;
  if (current < total - 1) {
    hideMessage(() => {
      current++;
      showMessage(current);
    });
  } else {
    hideMessage(() => {
      nextBtn.style.display  = "none";
      dotsEl.style.display   = "none";
      slideNum.style.display = "none";
      endMsg.classList.add("show");
    });
  }
}

/* ── BUTTON ── */
nextBtn.addEventListener("click", advance);

/* ── REPLAY ── */
replayBtn.addEventListener("click", () => {
  endMsg.classList.remove("show");
  nextBtn.style.display  = "";
  dotsEl.style.display   = "";
  slideNum.style.display = "";
  current = 0;
  buildDots();
  showMessage(0);
});

/* ── KEYBOARD (desktop) ── */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === " ") advance();
});

/* ── SWIPE LEFT (mobile) ── */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) advance(); // swipe left = next
  }
}, { passive: true });

/* ── INIT ── */
buildDots();
showMessage(0);
