# Notes‑App
A lightweight, client‑side notes app built with HTML, CSS, and vanilla JavaScript that stores notes in the browser using the Web Storage API’s localStorage for persistence between page reloads..

## Features
Create and edit notes directly in the page using contentEditable elements for an intuitive, no‑form editing experience..

Auto‑save to localStorage so notes persist across refreshes without any backend..

Click the trash icon in a note to remove it, with immediate update to localStorage..

Minimal, responsive UI with a gradient background and a single add‑note button..

## How it works
The app reads and writes the entire notes container’s HTML into localStorage, providing a simple persistence mechanism in a single key..

Each note is a contentEditable block; keyup events trigger storage updates to keep content synced..

Pressing Enter inserts a line break within a note; this implementation uses document.execCommand('insertLineBreak'), which is considered obsolete but still widely implemented; modern alternatives typically manage selection and insert HTML or rely on editable components..

## Getting started
Clone or download the project, then open index.html in a modern browser; no server is required since localStorage is available to file URLs in most desktop browsers, though a simple static server is recommended during development..

Optional: run a local static server (for example, VS Code Live Server or any HTTP server) to avoid file URL quirks and enable hot reload; access the app at the printed localhost URL..

## Project structure
index.html: The page markup, including the notes container and the “Add Note” button..

style.css: Global reset, container layout, button styling, and note card styles..

script.js: DOM bindings, create‑note handler, click/keyup listeners, and localStorage synchronization..

## Scripts and usage
Add a note: Click the “Add” button to append a new editable note with a delete icon; start typing immediately..

Delete a note: Click the note’s image icon to remove it; the storage is updated right away..

Auto‑save: Edits are saved on keyup; refresh the page to verify persistence..

## Browser support notes
localStorage is supported by all modern browsers, but capacity limits and per‑origin quotas apply; this app stores HTML strings per origin..

document.execCommand is marked obsolete; it still works in major browsers, but long‑term maintenance favors custom selection handling or libraries that manage rich‑text behaviors..

## Possible improvements
Store notes as JSON objects rather than raw innerHTML for safer, more controllable serialization; then render the DOM from data on load..

Add debounce for auto‑save to reduce writes, and implement unique IDs with per‑note CRUD operations in storage..

Replace execCommand with selection‑based insertion or a small editor utility for consistent line breaks and formatting..

Add keyboard shortcuts, drag‑to‑reorder, and simple full‑text search across notes..

## Deployment
Commit the three files to a GitHub repository and enable GitHub Pages for the main branch to serve the static site at https://<user>.github.io/<repo>/; no backend configuration is required..

Alternatively, deploy to any static host (Netlify, Vercel, or an S3 bucket with static hosting) by uploading the three files as is..


## *For my MVP, this is the output after hosting it on Netlify:*

<img width="1912" height="1011" alt="image" src="https://github.com/user-attachments/assets/d205786c-ccdd-4ef3-8140-d8efe414831f" />
