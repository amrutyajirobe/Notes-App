// State and selectors
const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn-new");
const searchInput = document.querySelector(".search-input");

const STORAGE_KEY = "notes.v2";

let notes = []; // [{id, title, body, createdAt, updatedAt, pinned, tags:[]}]

// Utilities
const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
const load = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        notes = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch {
        notes = [];
    }
};

const escapeHTML = (str) =>
    str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Rendering
function render(list = notes) {
    notesContainer.innerHTML = "";
    const sorted = [...list].sort((a, b) => (b.pinned - a.pinned) || (new Date(b.updatedAt) - new Date(a.updatedAt)));
    for (const n of sorted) {
        const card = document.createElement("div");
        card.className = "note-card";
        card.dataset.id = n.id;

        card.innerHTML = `
      <div class="note-header">
        <input class="note-title" value="${escapeHTML(n.title)}" placeholder="Title" />
        <div class="note-actions">
          <button class="pin-btn" title="Pin">${n.pinned ? "📌" : "📍"}</button>
          <button class="del-btn" title="Delete">🗑️</button>
        </div>
      </div>
      <textarea class="note-body" placeholder="Write your note...">${escapeHTML(n.body)}</textarea>
      <div class="note-footer">
        <input class="tag-input" value="${escapeHTML(n.tags.join(", "))}" placeholder="tags, comma,separated" />
        <span class="timestamps">Edited ${new Date(n.updatedAt).toLocaleString()}</span>
      </div>
    `;

        notesContainer.appendChild(card);
    }
}

// Actions
function createNote() {
    const n = {
        id: uid(),
        title: "",
        body: "",
        pinned: false,
        tags: [],
        createdAt: now(),
        updatedAt: now()
    };
    notes.unshift(n);
    save();
    render();
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    save();
    render();
}

function updateNote(id, patch) {
    const n = notes.find(n => n.id === id);
    if (!n) return;
    Object.assign(n, patch, { updatedAt: now() });
    save();
}

function filterNotes(q) {
    if (!q.trim()) return notes;
    const term = q.toLowerCase();
    return notes.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.body.toLowerCase().includes(term) ||
        n.tags.some(t => t.toLowerCase().includes(term))
    );
}

// Event wiring
let saveTimer;
function scheduleRender() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => render(filterNotes(searchInput.value || "")), 200);
}

notesContainer.addEventListener("input", (e) => {
    const card = e.target.closest(".note-card");
    if (!card) return;
    const id = card.dataset.id;

    if (e.target.classList.contains("note-title")) {
        updateNote(id, { title: e.target.value });
        scheduleRender();
    }
    if (e.target.classList.contains("note-body")) {
        updateNote(id, { body: e.target.value });
        scheduleRender();
    }
    if (e.target.classList.contains("tag-input")) {
        const tags = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
        updateNote(id, { tags });
    }
});

notesContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".note-card");
    if (!card) return;
    const id = card.dataset.id;

    if (e.target.classList.contains("del-btn")) {
        deleteNote(id);
    }
    if (e.target.classList.contains("pin-btn")) {
        const n = notes.find(n => n.id === id);
        updateNote(id, { pinned: !n.pinned });
        render(filterNotes(searchInput.value || ""));
    }
});

createBtn.addEventListener("click", () => createNote());

searchInput.addEventListener("input", () => {
    render(filterNotes(searchInput.value));
});

// Keyboard: Ctrl/Cmd+N new, Ctrl/Cmd+F focus search
document.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNote();
    }
    if (mod && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInput.focus();
    }
});

// Init
load();
render();
