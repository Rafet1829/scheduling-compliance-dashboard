const STORAGE_KEY = "rafet-scheduling-demo-v1";
const titles = {dashboard:"Operations overview",rota:"Staff rota",training:"Training compliance",leave:"Leave and cover",tasks:"Administrative action log"};
let currentView = "dashboard";
let query = "";
let state = loadState();

function cloneDemo() { return JSON.parse(JSON.stringify(window.DEMO_DATA)); }
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneDemo(); }
  catch { return cloneDemo(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function esc(value) { return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
function formatDate(value) { return new Intl.DateTimeFormat("en-GB", {day:"2-digit",month:"short",year:"numeric"}).format(new Date(`${value}T12:00:00`)); }
function badge(value) {
  const key = String(value).toLowerCase();
  const tone = key.includes("overdue") || key.includes("needs") || key === "high" ? "red" : key.includes("due soon") || key.includes("pending") || key.includes("progress") || key === "medium" ? "amber" : key.includes("covered") || key.includes("approved") || key.includes("current") || key.includes("complete") ? "green" : key === "low" ? "blue" : "grey";
  return `<span class="badge ${tone}">${esc(value)}</span>`;
}
function filtered(rows) {
  if (!query) return rows;
  const needle = query.toLowerCase();
  return rows.filter(row => Object.values(row).some(value => String(value).toLowerCase().includes(needle)));
}
function table(headers, rows, cells) {
  if (!rows.length) return `<div class="empty">No records match your search.</div>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row,i)=>`<tr>${cells(row,i).map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function pagePanel(title, subtitle, tableHtml) {
  return `<div class="panel table-panel"><div class="table-toolbar"><div><h2>${title}</h2><p>${subtitle}</p></div><span class="date-chip">Sample data</span></div>${tableHtml}</div>`;
}
function metrics() {
  return {
    shifts: state.rota.length,
    cover: state.rota.filter(x=>x.status === "Needs cover").length,
    training: state.training.filter(x=>x.status !== "Current").length,
    tasks: state.tasks.filter(x=>x.status !== "Complete").length,
    pendingLeave: state.leave.filter(x=>x.decision === "Pending").length,
    overdue: state.training.filter(x=>x.status === "Overdue").length,
    high: state.tasks.filter(x=>x.priority === "High" && x.status !== "Complete").length
  };
}
function renderDashboard() {
  const m = metrics();
  const statusCounts = [
    ["Overdue", state.training.filter(x=>x.status==="Overdue").length, "red"],
    ["Due soon", state.training.filter(x=>x.status==="Due soon").length, "amber"],
    ["Current", state.training.filter(x=>x.status==="Current").length, "green"]
  ];
  const max = Math.max(...statusCounts.map(x=>x[1]),1);
  return `<div class="section-heading"><div><h2>Weekly control centre</h2><p>Coverage, training and administrative priorities in one place.</p></div><span class="date-chip">Week of 07 Sep 2026</span></div>
  <div class="kpi-grid">
    ${[["Weekly shifts",m.shifts,"Scheduled","S"],["Needs cover",m.cover,"Action required","C"],["Training actions",m.training,"Due or overdue","T"],["Open tasks",m.tasks,"Across all workstreams","A"]].map(x=>`<article class="kpi-card"><div class="kpi-top"><span>${x[0]}</span><span class="kpi-icon">${x[3]}</span></div><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join("")}
  </div>
  <div class="dashboard-grid">
    <section class="panel"><h3>Priority exceptions</h3><p class="panel-subtitle">Items requiring coordination or follow-up.</p><div class="exception-list">
      ${[["Uncovered shifts",m.cover,"red"],["Pending leave requests",m.pendingLeave,"amber"],["Overdue training",m.overdue,"red"],["High-priority tasks open",m.high,"blue"]].map(x=>`<div class="exception"><div class="exception-label"><span class="status-dot ${x[2]}"></span>${x[0]}</div><span class="count">${x[1]}</span></div>`).join("")}
    </div></section>
    <section class="panel"><h3>Training status</h3><p class="panel-subtitle">Current position across ten fictional staff records.</p><div class="bar-list">
      ${statusCounts.map(x=>`<div><div class="bar-label"><span>${x[0]}</span><span>${x[1]}</span></div><div class="bar-track"><div class="bar ${x[2]}" style="width:${x[1]/max*100}%"></div></div></div>`).join("")}
    </div></section>
  </div>`;
}
function renderRota() {
  const rows = filtered(state.rota);
  return pagePanel("Weekly rota", "Select a coverage status to demonstrate live dashboard updates.", table(["Date","Day","Shift","Time","Role","Staff","Coverage","Notes",""], rows, (r)=>[
    formatDate(r.date),esc(r.day),esc(r.shift),esc(r.time),esc(r.role),esc(r.staff),badge(r.status),esc(r.note),`<button class="row-action" data-rota-date="${esc(r.date)}" data-rota-shift="${esc(r.shift)}">Toggle</button>`
  ]));
}
function renderTraining() {
  const rows = filtered(state.training);
  return pagePanel("Training register", "Expiry status and next actions for fictional staff records.", table(["Staff","Role","Training area","Due date","Status","Next action"], rows, r=>[
    esc(r.staff),esc(r.role),esc(r.course),formatDate(r.due),badge(r.status),esc(r.action)
  ]));
}
function renderLeave() {
  const rows = filtered(state.leave);
  return pagePanel("Leave and cover log", "Connects leave decisions with staffing-cover actions.", table(["Request","Staff","Type","Dates","Decision","Cover","Assigned","Coordinator note"], rows, r=>[
    esc(r.id),esc(r.staff),esc(r.type),`${formatDate(r.start)} – ${formatDate(r.end)}`,badge(r.decision),esc(r.cover),esc(r.assigned),esc(r.note)
  ]));
}
function renderTasks() {
  const rows = filtered(state.tasks);
  return pagePanel("Administrative actions", "Click a status to move the task through its workflow.", table(["ID","Workstream","Action","Priority","Owner","Due","Status","Evidence / note"], rows, r=>[
    esc(r.id),esc(r.workstream),esc(r.action),badge(r.priority),esc(r.owner),formatDate(r.dueDate),`<button class="row-action" data-task-id="${esc(r.id)}">${badge(r.status)}</button>`,esc(r.note || "—")
  ]));
}
function render() {
  document.getElementById("page-title").textContent = titles[currentView];
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===currentView));
  const views = {dashboard:renderDashboard,rota:renderRota,training:renderTraining,leave:renderLeave,tasks:renderTasks};
  document.getElementById("app-content").innerHTML = views[currentView]();
}

document.getElementById("primary-nav").addEventListener("click", event => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  currentView = button.dataset.view; query = ""; document.getElementById("global-search").value = ""; render();
});
document.getElementById("global-search").addEventListener("input", event => { query = event.target.value.trim(); render(); });
document.getElementById("app-content").addEventListener("click", event => {
  const rotaButton = event.target.closest("[data-rota-date]");
  if (rotaButton) {
    const row = state.rota.find(x=>x.date===rotaButton.dataset.rotaDate && x.shift===rotaButton.dataset.rotaShift);
    row.status = row.status === "Covered" ? "Needs cover" : "Covered";
    row.staff = row.status === "Covered" && row.staff === "Unassigned" ? "Staff TBD" : row.staff;
    saveState(); render(); return;
  }
  const taskButton = event.target.closest("[data-task-id]");
  if (taskButton) {
    const order = ["Not started","In progress","Complete"];
    const row = state.tasks.find(x=>x.id===taskButton.dataset.taskId);
    row.status = order[(order.indexOf(row.status)+1)%order.length]; saveState(); render();
  }
});
document.getElementById("add-task-button").addEventListener("click", ()=> {
  document.querySelector('[name="dueDate"]').value = "2026-09-14";
  document.getElementById("task-dialog").showModal();
});
document.getElementById("task-form").addEventListener("submit", event => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const form = new FormData(event.target);
  state.tasks.push({id:`AT-${String(state.tasks.length+1).padStart(3,"0")}`,workstream:form.get("workstream"),action:form.get("action"),priority:form.get("priority"),owner:"Rafet",dueDate:form.get("dueDate"),status:"Not started",note:form.get("note")});
  saveState(); event.target.reset(); document.getElementById("task-dialog").close(); currentView="tasks"; render();
});
document.getElementById("reset-button").addEventListener("click", ()=> { state=cloneDemo(); saveState(); render(); });
document.getElementById("export-button").addEventListener("click", ()=> {
  const rows = currentView === "dashboard" ? state.tasks : state[currentView];
  const headers = Object.keys(rows[0] || {});
  const csv = [headers.join(","), ...rows.map(row=>headers.map(h=>`"${String(row[h]??"").replaceAll('"','""')}"`).join(","))].join("\n");
  const link = document.createElement("a"); link.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); link.download=`rafet-${currentView}.csv`; link.click(); URL.revokeObjectURL(link.href);
});

render();
