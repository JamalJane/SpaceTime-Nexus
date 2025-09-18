/* app.js — all interactive logic, defensive & robust */
document.addEventListener("DOMContentLoaded", () => {
  /* Router */
  function showPageByHash() {
    const hash = location.hash || "#/";
    const mapping = {
      "#/": "page-home",
      "#": "page-home",
      "": "page-home",
      "#/calendar": "page-calendar",
      "#/projects": "page-projects",
      "#/chat": "page-chat",
      "#/skills": "page-skills",
      "#/map": "page-map"
    };
    const id = mapping[hash] || "page-404";
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const page = document.getElementById(id);
    if (page) page.classList.add("active");

    // nav highlight
    document.querySelectorAll(".nav-link").forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === hash);
    });
  }
  window.addEventListener("hashchange", showPageByHash);

  /* Wire buttons with data-nav */
  function wireNavButtons() {
    document.querySelectorAll("[data-nav]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-nav");
        if (typeof target === "string") location.hash = target;
      });
    });
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("main-nav");
    if (hamburger && nav) hamburger.addEventListener("click", () => nav.classList.toggle("open"));
  }

  /* ---------------- Calendar ---------------- */
  function renderCalendarGrid(containerId, days) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    container.classList.add("calendar-grid");
    const today = new Date().getDate();

    for (let d = 1; d <= days; d++) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      cell.dataset.day = d;
      cell.textContent = d;

      if (d === today) cell.classList.add("today");

      cell.addEventListener("click", () => {
        container.querySelectorAll(".calendar-cell").forEach(c => c.classList.remove("selected"));
        cell.classList.add("selected");
      });

      cell.addEventListener("dragover", e => e.preventDefault());
      cell.addEventListener("drop", e => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const ev = document.getElementById(id);
        if (ev) cell.appendChild(ev);
      });

      container.appendChild(cell);
    }
  }

  function addEventToCell(cell, title) {
    const id = `event-${Math.random().toString(36).slice(2, 9)}`;
    const ev = document.createElement("div");
    ev.className = "event";
    ev.id = id;
    ev.draggable = true;
    ev.dataset.event = title;
    ev.textContent = title;

    const badge = document.createElement("span");
    badge.className = "event-badge";
    ev.prepend(badge);

    ev.addEventListener("dragstart", e => {
      ev.classList.add("dragging");
      e.dataTransfer.setData("text/plain", ev.id);
    });
    ev.addEventListener("dragend", () => ev.classList.remove("dragging"));

    ev.addEventListener("click", e => {
      e.stopPropagation();
      ev.classList.toggle("selected");
    });

    cell.appendChild(ev);
  }

  function initCalendar() {
    renderCalendarGrid("calendar-preview", 14);
    renderCalendarGrid("calendar-full", 30);

    // seed demo events safely
    const preview = document.getElementById("calendar-preview");
    if (preview) {
      const c3 = preview.querySelector('[data-day="3"]');
      if (c3) addEventToCell(c3, "Team Sync");
      const today = preview.querySelector(".calendar-cell.today");
      if (today) addEventToCell(today, "Standup");
    }
    const full = document.getElementById("calendar-full");
    if (full) {
      const c5 = full.querySelector('[data-day="5"]');
      if (c5) addEventToCell(c5, "Review");
    }

    // Add event button on full calendar
    const addBtn = document.getElementById("event-add");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const day = parseInt(document.getElementById("event-date").value, 10);
        const title = document.getElementById("event-title").value.trim();
        if (!day || !title) {
          alert("Enter date (number) and title (demo).");
          return;
        }
        const grid = document.getElementById("calendar-full");
        if (!grid) return;
        const cell = Array.from(grid.querySelectorAll(".calendar-cell")).find(c => parseInt(c.dataset.day, 10) === day);
        if (cell) {
          addEventToCell(cell, title);
          document.getElementById("event-date").value = "";
          document.getElementById("event-title").value = "";
        } else {
          alert("Day not found in this demo month.");
        }
      });
    }
  }

  /* ---------------- Kanban ---------------- */
  function createTask(text) {
    const el = document.createElement("div");
    el.className = "kanban-task";
    const id = `task-${Math.random().toString(36).slice(2, 8)}`;
    el.id = id;
    el.textContent = text;
    el.draggable = true;
    el.addEventListener("dragstart", (e) => {
      el.classList.add("dragging");
      e.dataTransfer.setData("text/plain", el.id);
    });
    el.addEventListener("dragend", () => el.classList.remove("dragging"));
    return el;
  }

  function renderKanbanBoard(rootId) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = "";
    const cols = [
      { id: "todo", name: "To Do", tasks: ["Write spec", "Wireframes"] },
      { id: "doing", name: "Doing", tasks: ["Build header"] },
      { id: "done", name: "Done", tasks: ["Plan review"] },
    ];
    const board = document.createElement("div");
    board.className = "kanban";
    cols.forEach(c => {
      const col = document.createElement("div");
      col.className = "kanban-column";
      col.dataset.col = c.id;
      const h = document.createElement("h3");
      h.textContent = c.name;
      const tasksWrap = document.createElement("div");
      tasksWrap.className = "col-tasks";

      col.addEventListener("dragover", (e) => {
        e.preventDefault();
        col.classList.add("drag-over");
      });
      col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
      col.addEventListener("drop", (e) => {
        e.preventDefault();
        col.classList.remove("drag-over");
        const id = e.dataTransfer.getData("text/plain");
        const task = document.getElementById(id);
        if (task) tasksWrap.prepend(task);
      });

      c.tasks.forEach(t => tasksWrap.appendChild(createTask(t)));
      col.appendChild(h);
      col.appendChild(tasksWrap);
      board.appendChild(col);
    });

    root.appendChild(board);
  }

  function initKanban() {
    renderKanbanBoard("kanban-preview");
    renderKanbanBoard("kanban-full");

    const add = document.getElementById("add-task");
    if (add) {
      add.addEventListener("click", () => {
        const title = document.getElementById("new-task-title").value.trim();
        const colVal = document.getElementById("new-task-col").value;
        if (!title) {
          alert("Enter a task title (demo).");
          return;
        }
        const container = document.getElementById("kanban-full");
        if (!container) return;
        const column = container.querySelector(`[data-col="${colVal}"] .col-tasks`);
        if (column) column.prepend(createTask(title));
        document.getElementById("new-task-title").value = "";
      });
    }
  }

  /* ---------------- Chat ---------------- */
  function addChatMessage(container, who, text) {
    if (!container) return;
    const b = document.createElement("div");
    b.className = `chat-bubble ${who === "you" ? "you" : "other"}`;
    b.textContent = text;
    container.appendChild(b);
    container.scrollTop = container.scrollHeight;
  }

  function initChat() {
    const previewWin = document.getElementById("chat-preview-window");
    const prevInput = document.getElementById("chat-preview-input");
    const prevSend = document.getElementById("chat-preview-send");
    if (previewWin) {
      addChatMessage(previewWin, "other", "Welcome to Spacetime Nexus!");
      addChatMessage(previewWin, "you", "This looks great.");
    }
    if (prevSend) prevSend.addEventListener("click", () => {
      if (!prevInput.value.trim()) return;
      addChatMessage(previewWin, "you", prevInput.value.trim());
      prevInput.value = "";
      setTimeout(() => addChatMessage(previewWin, "other", "Nice — got it!"), 600);
    });

    const fullWin = document.getElementById("chat-full-window");
    const fullInput = document.getElementById("chat-full-input");
    const fullSend = document.getElementById("chat-full-send");
    if (fullWin) addChatMessage(fullWin, "other", "Full chat open — say hi.");
    if (fullSend) fullSend.addEventListener("click", () => {
      if (!fullInput.value.trim()) return;
      addChatMessage(fullWin, "you", fullInput.value.trim());
      fullInput.value = "";
      setTimeout(() => addChatMessage(fullWin, "other", "Auto reply (demo)"), 700);
    });
  }

  /* ---------------- Skills ---------------- */
  function renderSkillGrid(root, arr) {
    if (!root) return;
    root.innerHTML = "";
    root.classList.add("skills-grid");
    arr.forEach(s => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.textContent = s;
      card.addEventListener("click", () => card.classList.toggle("selected"));
      root.appendChild(card);
    });
  }

  function initSkills() {
    const skills = ["React", "UI Design", "Algorithms", "Python", "Baking", "Public Speaking"];
    renderSkillGrid(document.getElementById("skills-preview-grid"), skills);
    renderSkillGrid(document.getElementById("skills-full-grid"), skills.map(s => s + " — expanded"));
  }

  /* ---------------- Map ---------------- */
  function renderPins(svg, pins) {
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const ns = "http://www.w3.org/2000/svg";
    const bg = document.createElementNS(ns, "rect");
    bg.setAttribute("width", "100%");
    bg.setAttribute("height", "100%");
    bg.setAttribute("fill", "none");
    svg.appendChild(bg);

    pins.forEach(p => {
      const g = document.createElementNS(ns, "g");
      g.setAttribute("class", "pin");
      g.setAttribute("transform", `translate(${p.x}, ${p.y})`);
      const core = document.createElementNS(ns, "circle");
      core.setAttribute("class", "core");
      core.setAttribute("r", 10);
      core.setAttribute("cx", 0);
      core.setAttribute("cy", 0);

      const text = document.createElementNS(ns, "text");
      text.setAttribute("x", 16);
      text.setAttribute("y", 4);
      text.setAttribute("fill", "#e6eef6");
      text.setAttribute("font-size", "12");
      text.textContent = p.label;

      g.appendChild(core);
      g.appendChild(text);

      g.addEventListener("click", () => {
        svg.querySelectorAll(".pin").forEach(n => n.classList.remove("selected"));
        g.classList.add("selected");
      });

      svg.appendChild(g);
    });
  }

  function initMap() {
    const pins = [
      { id: "p1", x: 120, y: 200, label: "Quiet Library" },
      { id: "p2", x: 320, y: 80,  label: "Campus Cafe" },
      { id: "p3", x: 540, y: 260, label: "Study Lawn" },
      { id: "p4", x: 700, y: 140, label: "Sky Lounge" },
    ];
    renderPins(document.getElementById("map-preview-svg"), pins);
    renderPins(document.getElementById("map-full-svg"), pins);
  }

  /* Initialize everything safely */
  function initAll() {
    showPageByHash();
    wireNavButtons();
    initCalendar();
    initKanban();
    initChat();
    initSkills();
    initMap();
  }

  // Kick things off
  initAll();
});
