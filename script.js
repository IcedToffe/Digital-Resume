// script.js
//
// This page scrolls as one long page now (no tabs). The only real
// interactivity is: clicking a skill sticker clears the demo panel
// and calls one specific demo function. Each demo is self-contained
// so you can read, edit, or replace just one without touching the others.

const demoPanel = document.getElementById("demoPanel");
const demoBody = document.getElementById("demoBody");
const demoTitle = document.getElementById("demoTitle");
const closeDemo = document.getElementById("closeDemo");

// ---------- Dark / light theme toggle ----------
// Saved with localStorage so it's remembered next time this person
// visits — same technique as the favorites feature in the recipe picker.

const THEME_KEY = "digital-resume:theme";
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

function loadSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (err) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error("Could not save theme:", err);
  }
}

const savedTheme = loadSavedTheme();
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  saveTheme(next);
});

// ---------- Downloadable PDF ----------
// There's no PDF library here — window.print() opens the browser's normal
// print dialog, and "Save as PDF" is a built-in destination in every modern
// browser. The @media print rules in style.css control what that looks like.

document.getElementById("downloadPdf").addEventListener("click", () => {
  window.print();
});

// ---------- Contact form ----------
// No backend here, so "sending" the message means opening the person's own
// email app with everything pre-filled via a mailto: link. That's a real,
// working option for a static site with no server — just not fully
// automatic. (See the README for a no-backend alternative using Formspree
// if you want the message to arrive without opening an email app.)

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("cfName").value.trim();
  const email = document.getElementById("cfEmail").value.trim();
  const message = document.getElementById("cfMessage").value.trim();
  const to = contactForm.dataset.to;

  const subject = encodeURIComponent(`Message from ${name} (via resume site)`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  formNote.textContent = "Binuksan ang iyong email app. Kumpletuhin na lang ang pagpapadala doon.";
});

// ---------- Skill growth bars ----------
// Just a rough, honest self-rating per skill (0-100). Edit these numbers
// yourself as you improve — this isn't meant to be precise, just directional.

const skillLevels = [
  { label: "HTML", value: 85 },
  { label: "CSS Animation", value: 70 },
  { label: "JavaScript", value: 65 },
  { label: "Responsive Design", value: 60 },
  { label: "Git & GitHub", value: 55 },
  { label: "Problem Solving", value: 60 },
];

function renderSkillBars() {
  const container = document.getElementById("skillBars");
  container.innerHTML = "";

  skillLevels.forEach(({ label, value }) => {
    const row = document.createElement("div");
    row.className = "skill-bar-row";
    row.innerHTML = `
      <span class="skill-bar-label">${label}</span>
      <span class="skill-bar-track">
        <span class="skill-bar-fill" style="width: 0%"></span>
      </span>
    `;
    container.appendChild(row);

    // Animate in after a tick, so the width transition actually plays.
    requestAnimationFrame(() => {
      row.querySelector(".skill-bar-fill").style.width = `${value}%`;
    });
  });
}

renderSkillBars();

// ---------- Live GitHub stats ----------
// Uses GitHub's public API (no auth needed, ~60 requests/hour limit — plenty
// for a personal site). Update the data-username attribute on #githubStats
// in index.html to your real GitHub username.

async function loadGitHubStats() {
  const section = document.getElementById("githubStats");
  const status = document.getElementById("githubStatus");
  const grid = document.getElementById("githubGrid");
  const username = section.dataset.username;

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
    const user = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=1`
    );
    const repos = reposRes.ok ? await reposRes.json() : [];
    const latestRepo = repos[0];

    grid.innerHTML = `
      <div class="github-stat">
        <span class="github-stat-value">${user.public_repos}</span>
        <span class="github-stat-label">Public repos</span>
      </div>
      <div class="github-stat">
        <span class="github-stat-value">${user.followers}</span>
        <span class="github-stat-label">Followers</span>
      </div>
      <div class="github-stat">
        <span class="github-stat-value">${latestRepo ? latestRepo.name : "—"}</span>
        <span class="github-stat-label">Latest repo</span>
      </div>
    `;

    status.textContent = `@${username} on GitHub since ${new Date(user.created_at).getFullYear()}.`;
    grid.hidden = false;
  } catch (err) {
    status.textContent =
      `Hindi makuha ang GitHub data para kay "${username}". ` +
      `Siguraduhing tama ang username sa data-username attribute ng #githubStats.`;
    console.error("GitHub stats failed:", err);
  }
}

loadGitHubStats();

// ---------- Easter egg ----------
// Type "ojt" anywhere on the page.

let typedBuffer = "";
const secretWord = "ojt";

const easterToast = document.createElement("div");
easterToast.className = "easter-toast";
easterToast.textContent = "🎉 Sana all matanggap sa OJT nila! Ikaw kasama.";
document.body.appendChild(easterToast);

window.addEventListener("keydown", (e) => {
  if (e.key.length > 1) return; // ignore Shift, Enter, arrows, etc.

  typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-secretWord.length);

  if (typedBuffer === secretWord) {
    easterToast.classList.add("show");
    setTimeout(() => easterToast.classList.remove("show"), 3200);
  }
});

const demoRunners = {
  html: runHtmlDemo,
  css: runCssDemo,
  js: runJsDemo,
  responsive: runResponsiveDemo,
  git: runGitDemo,
  sort: runSortDemo,
};

const skillLabels = {
  html: "🎮 HTML — dinaan sa live typing",
  css: "🎮 CSS Animation — panoorin mo",
  js: "🎮 JavaScript — subukan mo mismo",
  responsive: "🎮 Responsive Design — i-drag ang slider",
  git: "🎮 Git & GitHub — parang totoong terminal",
  sort: "🎮 Problem Solving — bubble sort in action",
};

document.getElementById("skillsGrid").addEventListener("click", (e) => {
  const item = e.target.closest(".skill-sticker");
  if (!item) return;

  document.querySelectorAll(".skill-sticker").forEach((el) => el.classList.remove("active"));
  item.classList.add("active");

  demoPanel.hidden = false;
  demoTitle.textContent = skillLabels[item.dataset.skill] || "🎮 Tara, subukan!";
  demoBody.innerHTML = "";

  const runner = demoRunners[item.dataset.skill];
  if (runner) runner();

  demoPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

closeDemo.addEventListener("click", () => {
  demoPanel.hidden = true;
  document.querySelectorAll(".skill-sticker").forEach((el) => el.classList.remove("active"));
});

// Small helper: types text into an element one character at a time,
// used by the HTML and Git demos to feel like a live terminal.
function typeLines(container, lines, lineClass = "term-line", speed = 18) {
  let lineIndex = 0;

  function typeNextLine() {
    if (lineIndex >= lines.length) return;

    const p = document.createElement("p");
    p.className = lineClass;
    container.appendChild(p);

    const text = lines[lineIndex];
    let charIndex = 0;

    const interval = setInterval(() => {
      p.textContent = text.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex >= text.length) {
        clearInterval(interval);
        lineIndex++;
        setTimeout(typeNextLine, 150);
      }
    }, speed);
  }

  typeNextLine();
}

// --- HTML demo: types out a small nested markup snippet ---
function runHtmlDemo() {
  const lines = [
    "<section class=\"card\">",
    "  <h2>Hello, recruiter!</h2>",
    "  <p>Semantic markup, done on purpose.</p>",
    "</section>",
  ];
  typeLines(demoBody, lines, "term-line dim", 14);
}

// --- CSS demo: plays a small keyframe animation on a box ---
function runCssDemo() {
  const box = document.createElement("div");
  box.className = "demo-box";
  demoBody.appendChild(box);

  const note = document.createElement("p");
  note.className = "term-line dim";
  note.textContent = "// @keyframes moving box + color + border-radius shift";
  demoBody.appendChild(note);

  // Restart the animation every time this demo runs.
  requestAnimationFrame(() => box.classList.add("animating"));
}

// --- JavaScript demo: a genuinely interactive counter ---
function runJsDemo() {
  let count = 0;

  const row = document.createElement("div");
  row.className = "counter-row";
  row.innerHTML = `
    <button class="counter-btn" id="decBtn">−</button>
    <span class="counter-value" id="countValue">0</span>
    <button class="counter-btn" id="incBtn">+</button>
  `;
  demoBody.appendChild(row);

  const note = document.createElement("p");
  note.className = "term-line dim";
  note.style.marginTop = "0.8rem";
  note.textContent = "// real event listeners, real state — try clicking";
  demoBody.appendChild(note);

  const countValue = row.querySelector("#countValue");
  row.querySelector("#incBtn").addEventListener("click", () => {
    count++;
    countValue.textContent = count;
  });
  row.querySelector("#decBtn").addEventListener("click", () => {
    count--;
    countValue.textContent = count;
  });
}

// --- Responsive demo: a slider that resizes a preview, showing reflow ---
function runResponsiveDemo() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <input type="range" class="frame-slider" id="frameSlider" min="220" max="600" value="600">
    <div class="frame-preview" id="framePreview" style="width: 600px;">
      <div class="frame-card">Card A</div>
      <div class="frame-card">Card B</div>
      <div class="frame-card">Card C</div>
    </div>
    <p class="term-line dim" style="margin-top:0.8rem;">// drag to shrink the viewport — flexbox reflows automatically</p>
  `;
  demoBody.appendChild(wrap);

  const slider = wrap.querySelector("#frameSlider");
  const preview = wrap.querySelector("#framePreview");
  slider.addEventListener("input", () => {
    preview.style.width = `${slider.value}px`;
  });
}

// --- Git demo: types out a fake but plausible commit log ---
function runGitDemo() {
  const lines = [
    "$ git log --oneline",
    "a3f9c21 Add responsive nav for mobile",
    "7e21b3d Fix overflow bug on small screens",
    "2b6d4aa Add dark mode toggle",
    "1c9f0aa Initial commit",
  ];
  typeLines(demoBody, lines, "term-line", 16);
}

// --- Problem solving demo: a small bubble sort visualization ---
function runSortDemo() {
  const values = [5, 2, 8, 1, 9, 3, 7];

  const wrap = document.createElement("div");
  const barsEl = document.createElement("div");
  barsEl.className = "sort-bars";
  wrap.appendChild(barsEl);

  const btn = document.createElement("button");
  btn.className = "run-btn";
  btn.textContent = "Run bubble sort";
  wrap.appendChild(btn);

  demoBody.appendChild(wrap);

  function renderBars(arr, activeIndices = [], sortedFrom = arr.length) {
    barsEl.innerHTML = "";
    arr.forEach((val, i) => {
      const bar = document.createElement("div");
      bar.className = "sort-bar";
      bar.style.height = `${val * 10}px`;
      if (i >= sortedFrom) bar.classList.add("sorted");
      if (activeIndices.includes(i)) bar.classList.add("comparing");
      barsEl.appendChild(bar);
    });
  }

  renderBars(values);

  btn.addEventListener("click", () => {
    btn.disabled = true;
    const arr = [...values];
    let i = 0, j = 0;

    function step() {
      if (i >= arr.length - 1) {
        renderBars(arr, [], 0);
        btn.disabled = false;
        return;
      }

      if (j >= arr.length - i - 1) {
        i++;
        j = 0;
        setTimeout(step, 120);
        return;
      }

      renderBars(arr, [j, j + 1], arr.length - i);

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }

      j++;
      setTimeout(step, 220);
    }

    step();
  });
}
