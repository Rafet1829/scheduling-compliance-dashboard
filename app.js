const STORAGE_KEY = "rafet-scheduling-demo-v1";
const titles = {dashboard:"Operations overview",rota:"Staff rota",training:"Training compliance",leave:"Leave and cover",tasks:"Administrative action log",staff:"Staff directory"};
let currentView = "dashboard";
let query = "";
let state = loadState();

function normaliseState(data) {
  data.staff ||= cloneDemo().staff;
  data.rota = data.rota.map((row, index) => {
    const [start, end] = (row.time || "07:00–15:00").split("–");
    return {...row,id:row.id || `SH-${String(index+1).padStart(3,"0")}`,start:row.start || start,end:row.end || end,task:row.task || row.note || "General shift duties"};
  });
  return data;
}
function cloneDemo() { return JSON.parse(JSON.stringify(window.DEMO_DATA)); }
function loadState() {
  try { return normaliseState(JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneDemo()); }
  catch { return normaliseState(cloneDemo()); }
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
    hours: state.rota.reduce((sum,row)=>sum+Number(row.hours || calculateHours(row.start,row.end)),0),
    cover: state.rota.filter(x=>x.status === "Needs cover").length,
    training: state.training.filter(x=>x.status !== "Current").length,
    tasks: state.tasks.filter(x=>x.status !== "Complete").length,
    pendingLeave: state.leave.filter(x=>x.decision === "Pending").length,
    overdue: state.training.filter(x=>x.status === "Overdue").length,
    high: state.tasks.filter(x=>x.priority === "High" && x.status !== "Complete").length
  };
}
function calculateHours(start, end) {
  if (!start || !end) return 0;
  const [sh,sm]=start.split(":").map(Number), [eh,em]=end.split(":").map(Number);
  let minutes=(eh*60+em)-(sh*60+sm); if(minutes<0) minutes+=24*60;
  return Math.round(minutes/6)/10;
}
function hasConflict(row) {
  if (!row.staff || row.staff === "Unassigned" || row.staff === "Staff TBD") return false;
  return state.rota.some(other=>other.id!==row.id && other.date===row.date && other.staff===row.staff && other.start < row.end && row.start < other.end);
}
function staffOptions(selected) {
  return [`<option value="Unassigned"${selected==="Unassigned"?" selected":""}>Unassigned</option>`,...state.staff.map(person=>`<option value="${esc(person.name)}"${selected===person.name?" selected":""}>${esc(person.name)} · ${esc(person.role)}</option>`)].join("");
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
    ${[["Weekly shifts",m.shifts,`${m.hours} scheduled hours`,"S"],["Needs cover",m.cover,"Action required","C"],["Training actions",m.training,"Due or overdue","T"],["Open tasks",m.tasks,"Across all workstreams","A"]].map(x=>`<article class="kpi-card"><div class="kpi-top"><span>${x[0]}</span><span class="kpi-icon">${x[3]}</span></div><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join("")}
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
  return pagePanel("Weekly rota", "Create shifts, assign staff and tasks, or edit an existing rota record.", table(["Date","Shift","Time","Role","Assigned staff","Shift task","Coverage","Actions"], rows, (r)=>[
    `${formatDate(r.date)}<small class="conflict-note">${hasConflict(r)?"Assignment conflict":""}</small>`,
    esc(r.shift),`${esc(r.start)}–${esc(r.end)}<br><small>${esc(r.hours)} hours</small>`,esc(r.role),
    `<select class="assignment" data-assign-shift="${esc(r.id)}">${staffOptions(r.staff)}</select>`,esc(r.task),badge(r.status),
    `<div class="row-actions"><button class="row-action" data-edit-shift="${esc(r.id)}">Edit</button><button class="row-action danger" data-delete-shift="${esc(r.id)}">Delete</button></div>`
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
function renderStaff() {
  const rows=filtered(state.staff);
  const hours=name=>state.rota.filter(row=>row.staff===name).reduce((sum,row)=>sum+Number(row.hours||0),0);
  return pagePanel("Staff directory", "The rota assignment list is controlled by these staff records.", table(["Staff ID","Name","Default role","Availability","Contract hours","Scheduled hours"],rows,r=>[
    esc(r.id),esc(r.name),esc(r.role),esc(r.availability),`${esc(r.weeklyHours)} hours`,`${hours(r.name)} hours`
  ]));
}
function render() {
  document.getElementById("page-title").textContent = titles[currentView];
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===currentView));
  const views = {dashboard:renderDashboard,rota:renderRota,training:renderTraining,leave:renderLeave,tasks:renderTasks,staff:renderStaff};
  document.getElementById("app-content").innerHTML = views[currentView]();
  document.getElementById("add-task-button").classList.toggle("hidden",currentView!=="tasks" && currentView!=="dashboard");
  document.getElementById("add-shift-button").classList.toggle("hidden",currentView!=="rota");
  document.getElementById("add-staff-button").classList.toggle("hidden",currentView!=="staff");
}

document.getElementById("primary-nav").addEventListener("click", event => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  currentView = button.dataset.view; query = ""; document.getElementById("global-search").value = ""; render();
});
document.getElementById("global-search").addEventListener("input", event => { query = event.target.value.trim(); render(); });
document.getElementById("app-content").addEventListener("change", event => {
  const select=event.target.closest("[data-assign-shift]");
  if(!select) return;
  const row=state.rota.find(x=>x.id===select.dataset.assignShift);
  row.staff=select.value;
  row.status=select.value==="Unassigned"?"Needs cover":"Covered";
  saveState(); render();
});
document.getElementById("app-content").addEventListener("click", event => {
  const editShift=event.target.closest("[data-edit-shift]");
  if(editShift){ openShiftDialog(state.rota.find(x=>x.id===editShift.dataset.editShift)); return; }
  const deleteShift=event.target.closest("[data-delete-shift]");
  if(deleteShift){
    const row=state.rota.find(x=>x.id===deleteShift.dataset.deleteShift);
    if(window.confirm(`Delete the ${row.shift.toLowerCase()} shift on ${formatDate(row.date)}?`)){
      state.rota=state.rota.filter(x=>x.id!==row.id); saveState(); render();
    }
    return;
  }
  const taskButton = event.target.closest("[data-task-id]");
  if (taskButton) {
    const order = ["Not started","In progress","Complete"];
    const row = state.tasks.find(x=>x.id===taskButton.dataset.taskId);
    row.status = order[(order.indexOf(row.status)+1)%order.length]; saveState(); render();
  }
});
function openShiftDialog(row=null){
  const form=document.getElementById("shift-form"); form.reset();
  form.elements.shiftId.value=row?.id||"";
  form.elements.date.value=row?.date||"2026-09-14";
  form.elements.shift.value=row?.shift||"Early";
  form.elements.start.value=row?.start||"07:00";
  form.elements.end.value=row?.end||"15:00";
  form.elements.role.value=row?.role||"Administrator";
  document.getElementById("shift-staff-select").innerHTML=staffOptions(row?.staff||"Unassigned");
  form.elements.staff.value=row?.staff||"Unassigned";
  form.elements.task.value=row?.task||""; form.elements.note.value=row?.note||"";
  document.getElementById("shift-dialog-title").textContent=row?"Edit shift":"Add shift";
  document.getElementById("shift-dialog").showModal();
}
document.getElementById("add-shift-button").addEventListener("click",()=>openShiftDialog());
document.getElementById("shift-form").addEventListener("submit",event=>{
  if(event.submitter?.value==="cancel") return;
  event.preventDefault(); const form=new FormData(event.target); const id=form.get("shiftId")||`SH-${Date.now()}`;
  const date=form.get("date"), start=form.get("start"), end=form.get("end"), staff=form.get("staff");
  const record={id,date,day:new Intl.DateTimeFormat("en-GB",{weekday:"long"}).format(new Date(`${date}T12:00:00`)),shift:form.get("shift"),start,end,time:`${start}–${end}`,hours:calculateHours(start,end),role:form.get("role"),staff,task:form.get("task"),status:staff==="Unassigned"?"Needs cover":"Covered",note:form.get("note")};
  const index=state.rota.findIndex(x=>x.id===id); if(index>=0) state.rota[index]=record; else state.rota.push(record);
  state.rota.sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start)); saveState(); document.getElementById("shift-dialog").close(); render();
});
document.getElementById("add-staff-button").addEventListener("click",()=>document.getElementById("staff-dialog").showModal());
document.getElementById("staff-form").addEventListener("submit",event=>{
  if(event.submitter?.value==="cancel") return;
  event.preventDefault(); const form=new FormData(event.target); const name=String(form.get("name")).trim();
  if(state.staff.some(x=>x.name.toLowerCase()===name.toLowerCase())){ window.alert("That staff name already exists."); return; }
  state.staff.push({id:`ST-${String(state.staff.length+1).padStart(3,"0")}`,name,role:form.get("role"),weeklyHours:Number(form.get("weeklyHours")),availability:form.get("availability")});
  saveState(); event.target.reset(); document.getElementById("staff-dialog").close(); render();
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
document.getElementById("reset-button").addEventListener("click", ()=> { state=normaliseState(cloneDemo()); saveState(); render(); });
document.getElementById("export-button").addEventListener("click", ()=> {
  const rows = currentView === "dashboard" ? state.tasks : state[currentView];
  const headers = Object.keys(rows[0] || {});
  const csv = [headers.join(","), ...rows.map(row=>headers.map(h=>`"${String(row[h]??"").replaceAll('"','""')}"`).join(","))].join("\n");
  const link = document.createElement("a"); link.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); link.download=`rafet-${currentView}.csv`; link.click(); URL.revokeObjectURL(link.href);
});

render();
