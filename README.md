# Digital Resume 

A colorful, playful personal resume site. Styled like a notebook covered
in stickers, matching the same personality as my other two projects. Instead
of a static list of skills, each one is clickable. Click it and it actually
runs, showing a live demo right on the page.

**[Live demo →](#)** *(add your deployed link here once you host it)*

## Why I built this

Anyone can list "HTML, CSS, JavaScript" on a resume. I wanted mine to prove
it — clicking each skill triggers real, working code: a CSS keyframe
animation, a genuinely interactive counter, a live responsive-layout demo,
a typed-out git log, and a bubble sort visualization.

## Features

- Bright, sticker-style cards with a bit of tilt, like a decorated notebook
- 6 clickable skills, each running a different live demo (HTML, CSS Animation, JavaScript, Responsive Design, Git & GitHub, Problem Solving)
- **Skill growth bars** — a rough, honest self-rating per skill (edit the numbers as you improve)
- **Availability status badge** — edit the text/color in `index.html` to reflect whether you're open for OJT
- **"Currently learning" section** — shows growth, not just finished skills
- **Live GitHub stats** — pulls your real public repo count, followers, and latest repo via GitHub's public API (no login needed)
- **Testimonials section** — swap the placeholder quotes for real ones from professors/groupmates
- **Small easter egg** — type "ojt" anywhere on the page
- Dark/light theme toggle, saved with `localStorage`
- Downloadable PDF via the browser's print dialog (dedicated print stylesheet)
- Contact form that opens the visitor's email app, pre-filled (see note below)
- Fully responsive, single scrolling page
- No frameworks — plain HTML, CSS, and JavaScript

## Before you push this — required edits

- Your real name, bio, and role throughout `index.html`
- The `data-username="yourusername"` attribute on `#githubStats` → your real GitHub username
- The `data-to="you@email.com"` attribute on the contact form → your real email
- The GitHub/LinkedIn links (currently `#`) in the projects and contact sections
- The testimonial quotes → real ones if you can get them, or remove the section if you can't yet
- The skill bar percentages in `script.js` (`skillLevels`) → your own honest self-rating
- The status badge text/emoji in the hero section

## About the contact form

Since this is a static site with no backend/server, the form can't silently
send an email on its own — no static HTML/JS site can, without a paid
service or your own backend. What it does instead: it opens the visitor's
default email app with the subject and message pre-filled, so they just hit
send. This is a completely normal pattern for a portfolio site.

If you want messages to arrive without the visitor needing an email app open
(a more "automatic" feel), the standard beginner-friendly option is
[Formspree](https://formspree.io) — you'd sign up free, get a form endpoint
URL, and change the form's behavior to POST to that URL instead of using
`mailto:`. That's a good "what I'd add next" upgrade to mention in an
interview even if you don't implement it.

## Tech stack

- HTML5
- CSS3 (custom properties, keyframe animations, grid/flexbox, print media queries)
- Vanilla JavaScript (DOM manipulation, event listeners, localStorage, setTimeout-based animation)

## Running it locally

Just open `index.html` in your browser — no server or build step needed
(unlike the recipe picker project, this one doesn't fetch any external files).

## Before you push this

Update the placeholders in `index.html`:
- Your real name, bio, and role in `about.js`
- Your actual GitHub links in `projects.js` (replace the `#` hrefs)
- Your real email, GitHub, and LinkedIn in `contact.js`


## Author

Built by Milo ^_^
