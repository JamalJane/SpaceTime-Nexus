/* ============================
   Spacetime Nexus — app.js
   - All page logic in one file.
   - Hash routing toggles page sections contained in index.html.
   - Calendar: preview + full calendar with simple events & drag/drop move.
   - Kanban: HTML5 drag & drop across columns (preview + full).
   - Chat: local messages (purple = you, blue = others) with a demo auto-reply.
   - Skills: toggle cards to 'select' interests.
   - Map: interactive SVG pins; selected pins pulse purple.
   ============================ */

(function () {
  /* -------------------------
     Router — hash routing
     ------------------------- */
  const pages = {
    "#/": "page-home",
    "": "page-home",
    "#": "page-home",
    "#/calendar": "page-calendar",
    "#/projects": "page-projects",
    "#/chat": "page-chat",
    "#/skills": "page-skills",
    "#/map": "page-map",
  };

  function showPageByHash() {
    const id = pages[location.hash] || "page-404";
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    const node = document.getElementById(id);
    if (node) node.classList.add("active");

    // highlight nav
    document.querySelectorAll(".nav-link").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === location.hash);
    });
  }
  window.addEventListener("hashchange", showPageByHash);
  window.addEventListener("load", () => {
    showPageByHash();
    wireNavButtons();
    initCalendar();
    initKanban();
    initChat();
    initSkills();
    initMap();
  });

  /* Wire buttons with [data-nav] attribute to navigate */
  function wireNavButtons() {
    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => (location.hash = btn.getAttribute("data-nav")));
    });
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("main-nav");
    hamburger.addEventListener("click", () => nav.classList.toggle("open"));
  }

  /* -------------------------
     Calendar (preview + full)
     - Render cells and events.
     - You can add a demo event (full page) and drag it between cells.
     - CSS classes:
       .today -> blue highlight
       .selected -> purple outline
       .event-badge -> small blue dot
  */
  function initCalendar() {
    renderCalendarGrid("calendar-preview", 14); // small preview
    renderCalendarGrid("calendar-full", 30); // full page (30-day demo)

    // Event add UI on full calendar page
    const addBtn = document.getElementById("event-add");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const day = parseInt(document.getElementById("event-date").value, 10);
        const title = document.getElementById("event-title").value.trim();
        if (!day || !title) return alert("Enter date number and title (demo)");
        // find cell (we used 1..days numbering)
        const grid = document.getElementById("calendar-full");
        const cells = Array.from(grid.querySelectorAll(".calendar-cell"));
        const cell = cells.find((c) => parseInt(c.dataset.day, 10) === day);
        if (cell) addEventToCell(cell, title);
      });
    }
  }

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
      // mark today
      if (d === today) cell.classList.add("today");

      // click selects (purple outline)
      cell.addEventListener("click", () => {
        container.querySelectorAll(".calendar-cell").forEach((c) => c.classList.remove("selected"));
        cell.classList.add("selected");
      });

      // allow drops for events
      cell.addEventListener("dragover", (e) => e.preventDefault());
      cell.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const ev = document.getElementById(id);
        if (ev && ev.dataset.event) {
          // move event node into this cell
          cell.appendChild(ev);
          ev.classList.remove("dragging");
        }
      });

      container.appendChild(cell);
    }

    // seed a demo event on a couple of cells
    if (containerId === "calendar-preview") {
      // attach small blue dot to day 3 and day today
      const previewCells = container.querySelectorAll(".calendar-cell");
      if (previewCells[2]) addEventToCell(previewCells[2], "Team Sync");
      const todayCell = Array.from(previewCells).find((c) => c.classList.contains("today"));
      if (todayCell) addEventToCell(todayCell, "Standup");
    } else {
      // full calendar demo: add an event to day 5
      const fullCells = container.querySelectorAll(".calendar-cell");
      if (fullCells[4]) addEventToCell(fullCells[4], "Review");
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
    // small badge for preview
    const badge = document.createElement("span");
    badge.className = "event-badge";
    ev.prepend(badge);

    // drag handlers
    ev.addEventListener("dragstart", (e) => {
      ev.classList.add("dragging");
      e.dataTransfer.setData("text/plain", ev.id);
    });
    ev.addEventListener("dragend", () => ev.classList.remove("dragging"));

    // click toggles selection highlight
    ev.addEventListener("click", (e) => {
      e.stopPropagation();
      ev.classList.toggle("selected");
    });

    cell.appendChild(ev);
  }

  /* -------------------------
     Kanban (preview + full)
     - Simple HTML5 drag & drop.
     - Columns: todo, doing, done
     - .kanban-column.drag-over shows blue dashed border on possible drop target
  */
  function initKanban() {
    renderKanbanBoard("kanban-preview");
    renderKanbanBoard("kanban-full");
    // add task button on Projects page
    const add = document.getElementById("add-task");
    if (add) {
      add.addEventListener("click", () => {
        const title = document.getElementById("new-task-title").value.trim();
        const col = document.getElementById("new-task-col").value;
        if (!title) return alert("Type a task title (demo)");
        const container = document.getElementById("kanban-full");
        const column = container.querySelector(`[data-col="${col}"] .col-tasks`);
        column && column.prepend(createTask(title));
      });
    }
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
    cols.forEach((c) => {
      const col = document.createElement("div");
      col.className = "kanban-column";
      col.dataset.col = c.id;
      const h = document.createElement("h3");
      h.textContent = c.name;
      const tasksWrap = document.createElement("div");
      tasksWrap.className = "col-tasks";

      // make column a drop target
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

      c.tasks.forEach((t) => tasksWrap.appendChild(createTask(t)));
      col.appendChild(h);
      col.appendChild(tasksWrap);
      board.appendChild(col);
    });
    root.appendChild(board);
  }

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

  /* -------------------------
     Chat
     - Two places: preview and full.
     - User messages have class 'you' (purple), others have 'other' (blue).
  */
  function initChat() {
    // preview
    const previewWin = document.getElementById("chat-preview-window");
    const previewInput = document.getElementById("chat-preview-input");
    const previewSend = document.getElementById("chat-preview-send");
    if (previewWin) {
      addChatMessage(previewWin, "other", "Welcome to Spacetime Nexus!");
      addChatMessage(previewWin, "you", "Hey — this looks great.");
    }
    if (previewSend) {
      previewSend.addEventListener("click", () => {
        if (!previewInput.value.trim()) return;
        addChatMessage(previewWin, "you", previewInput.value.trim());
        previewInput.value = "";
        // auto reply
        setTimeout(() => addChatMessage(previewWin, "other", "Nice — got it!"), 600);
      });
    }

    // full chat
    const fullWin = document.getElementById("chat-full-window");
    const fullInput = document.getElementById("chat-full-input");
    const fullSend = document.getElementById("chat-full-send");
    if (fullWin) addChatMessage(fullWin, "other", "Full chat open — say hi.");
    if (fullSend) {
      fullSend.addEventListener("click", () => {
        if (!fullInput.value.trim()) return;
        addChatMessage(fullWin, "you", fullInput.value.trim());
        fullInput.value = "";
        setTimeout(() => addChatMessage(fullWin, "other", "Auto reply (demo)"), 700);
      });
    }
  }

  function addChatMessage(container, who, text) {
    if (!container) return;
    const b = document.createElement("div");
    b.className = `chat-bubble ${who === "you" ? "you" : "other"}`;
    b.textContent = text;
    container.appendChild(b);
    // scroll
    container.scrollTop = container.scrollHeight;
  }

  /* -------------------------
     Skills
     - Click a skill card to toggle selected state (blue glow / purple outline)
  */
  function initSkills() {
    const skills = ["React", "UI Design", "Algorithms", "Public Speaking", "Python", "Baking"];
    const previewGrid = document.getElementById("skills-preview-grid");
    const fullGrid = document.getElementById("skills-full-grid");
    if (previewGrid) renderSkillGrid(previewGrid, skills);
    if (fullGrid) renderSkillGrid(fullGrid, skills.map((s) => s + " — expanded"));
  }

  function renderSkillGrid(root, arr) {
    root.innerHTML = "";
    root.classList.add("skills-grid");
    arr.forEach((s) => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.textContent = s;
      card.addEventListener("click", () => card.classList.toggle("selected"));
      root.appendChild(card);
    });
  }

  /* -------------------------
     Map (SVG pins)
     - Pins default neon blue; selected pin pulses purple (CSS).
     - Clicking a pin deselects others and selects this one.
  */
  function initMap() {
    const previewSvg = document.getElementById("map-preview-svg");
    const fullSvg = document.getElementById("map-full-svg");
    const pins = [
      { id: "p1", x: 120, y: 200, label: "Quiet Library" },
      { id: "p2", x: 320, y: 80, label: "Campus Cafe" },
      { id: "p3", x: 540, y: 260, label: "Study Lawn" },
      { id: "p4", x: 700, y: 140, label: "Sky Lounge" },
    ];
    if (previewSvg) renderPins(previewSvg, pins, 800, 400);
    if (fullSvg) renderPins(fullSvg, pins, 1200, 600);
  }

  function renderPins(svg, pins, w, h) {
    svg.innerHTML = "";
    // dark rect background
    const ns = "http://www.w3.org/2000/svg";
    const bg = document.createElementNS(ns, "rect");
    bg.setAttribute("width", "100%");
    bg.setAttribute("height", "100%");
    bg.setAttribute("fill", "none");
    svg.appendChild(bg);

    pins.forEach((p) => {
      const g = document.createElementNS(ns, "g");
      g.setAttribute("class", "pin");
      g.setAttribute("transform", `translate(${p.x}, ${p.y})`);
      g.dataset.id = p.id;
      // core circle
      const core = document.createElementNS(ns, "circle");
      core.setAttribute("class", "core");
      core.setAttribute("r", 10);
      core.setAttribute("cx", 0);
      core.setAttribute("cy", 0);
      // label
      const text = document.createElementNS(ns, "text");
      text.setAttribute("x", 16);
      text.setAttribute("y", 4);
      text.setAttribute("fill", "#e6eef6");
      text.setAttribute("font-size", "12");
      text.textContent = p.label;

      g.appendChild(core);
      g.appendChild(text);

      g.addEventListener("click", () => {
        // deselect others
        svg.querySelectorAll(".pin").forEach((pn) => pn.classList.remove("selected"));
        g.classList.add("selected");
      });

      svg.appendChild(g);
    });
  }
})();
