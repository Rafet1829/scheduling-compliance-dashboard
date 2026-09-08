window.DEMO_DATA = {
  rota: [
    {date:"2026-09-07",day:"Monday",shift:"Early",time:"07:00–15:00",hours:8,role:"Team Lead",staff:"Staff A",status:"Covered",note:"Opening checks"},
    {date:"2026-09-07",day:"Monday",shift:"Late",time:"14:00–22:00",hours:8,role:"Coordinator",staff:"Staff B",status:"Covered",note:"Closing report"},
    {date:"2026-09-08",day:"Tuesday",shift:"Early",time:"07:00–15:00",hours:8,role:"Administrator",staff:"Staff C",status:"Covered",note:"Visitor and records support"},
    {date:"2026-09-08",day:"Tuesday",shift:"Late",time:"14:00–22:00",hours:8,role:"Coordinator",staff:"Unassigned",status:"Needs cover",note:"Leave request approved"},
    {date:"2026-09-09",day:"Wednesday",shift:"Early",time:"07:00–15:00",hours:8,role:"Team Lead",staff:"Staff D",status:"Covered",note:"Training observation"},
    {date:"2026-09-09",day:"Wednesday",shift:"Late",time:"14:00–22:00",hours:8,role:"Administrator",staff:"Staff E",status:"Covered",note:"Records update"},
    {date:"2026-09-10",day:"Thursday",shift:"Early",time:"07:00–15:00",hours:8,role:"Coordinator",staff:"Staff F",status:"Covered",note:"Supplier calls"},
    {date:"2026-09-10",day:"Thursday",shift:"Late",time:"14:00–22:00",hours:8,role:"Team Lead",staff:"Staff G",status:"Covered",note:"Compliance check"},
    {date:"2026-09-11",day:"Friday",shift:"Early",time:"07:00–15:00",hours:8,role:"Administrator",staff:"Unassigned",status:"Needs cover",note:"Awaiting availability"},
    {date:"2026-09-11",day:"Friday",shift:"Late",time:"14:00–22:00",hours:8,role:"Coordinator",staff:"Staff H",status:"Covered",note:"Weekly summary"},
    {date:"2026-09-12",day:"Saturday",shift:"Early",time:"08:00–16:00",hours:8,role:"Team Lead",staff:"Staff I",status:"Covered",note:"Weekend supervision"},
    {date:"2026-09-12",day:"Saturday",shift:"Late",time:"12:00–20:00",hours:8,role:"Administrator",staff:"Staff J",status:"Covered",note:"Customer support"},
    {date:"2026-09-13",day:"Sunday",shift:"Early",time:"09:00–17:00",hours:8,role:"Coordinator",staff:"Staff B",status:"Covered",note:"Weekend coordination"},
    {date:"2026-09-13",day:"Sunday",shift:"Late",time:"12:00–20:00",hours:8,role:"Team Lead",staff:"Staff A",status:"Covered",note:"Closing review"}
  ],
  training: [
    {staff:"Staff A",role:"Team Lead",course:"Fire Safety",due:"2026-09-22",status:"Due soon",action:"Send reminder and schedule"},
    {staff:"Staff B",role:"Coordinator",course:"Data Protection",due:"2026-09-18",status:"Due soon",action:"Send reminder and schedule"},
    {staff:"Staff C",role:"Administrator",course:"Health & Safety",due:"2026-08-30",status:"Overdue",action:"Book training immediately"},
    {staff:"Staff D",role:"Team Lead",course:"Customer Service",due:"2026-09-25",status:"Due soon",action:"Send reminder and schedule"},
    {staff:"Staff E",role:"Administrator",course:"Health & Safety",due:"2026-10-05",status:"Due soon",action:"Send reminder and schedule"},
    {staff:"Staff F",role:"Coordinator",course:"Customer Service",due:"2027-04-10",status:"Current",action:"No action"},
    {staff:"Staff G",role:"Team Lead",course:"Health & Safety",due:"2026-08-28",status:"Overdue",action:"Book training immediately"},
    {staff:"Staff H",role:"Coordinator",course:"Customer Service",due:"2026-09-15",status:"Due soon",action:"Send reminder and schedule"},
    {staff:"Staff I",role:"Team Lead",course:"Data Protection",due:"2027-01-05",status:"Current",action:"No action"},
    {staff:"Staff J",role:"Administrator",course:"Fire Safety",due:"2026-09-29",status:"Due soon",action:"Send reminder and schedule"}
  ],
  leave: [
    {id:"LR-001",staff:"Staff C",type:"Annual leave",start:"2026-09-08",end:"2026-09-08",decision:"Approved",cover:"Required",assigned:"Unassigned",note:"Escalate Tuesday late-shift cover"},
    {id:"LR-002",staff:"Staff F",type:"Appointment",start:"2026-09-10",end:"2026-09-10",decision:"Approved",cover:"Not required",assigned:"—",note:"Shift adjusted"},
    {id:"LR-003",staff:"Staff J",type:"Annual leave",start:"2026-09-18",end:"2026-09-20",decision:"Pending",cover:"Required",assigned:"Staff E",note:"Await manager decision"},
    {id:"LR-004",staff:"Staff D",type:"Training day",start:"2026-09-15",end:"2026-09-15",decision:"Approved",cover:"Required",assigned:"Staff A",note:"Cover confirmed"},
    {id:"LR-005",staff:"Staff H",type:"Annual leave",start:"2026-09-25",end:"2026-09-27",decision:"Pending",cover:"Required",assigned:"Unassigned",note:"Check availability list"},
    {id:"LR-006",staff:"Staff B",type:"Appointment",start:"2026-09-13",end:"2026-09-13",decision:"Approved",cover:"Not required",assigned:"—",note:"Starts after appointment"}
  ],
  tasks: [
    {id:"AT-001",workstream:"Rota",action:"Confirm Tuesday cover",priority:"High",owner:"Rafet",dueDate:"2026-09-07",status:"In progress",note:"Availability requests sent"},
    {id:"AT-002",workstream:"Training",action:"Book overdue Health & Safety sessions",priority:"High",owner:"Rafet",dueDate:"2026-09-08",status:"Not started",note:"Two staff identified"},
    {id:"AT-003",workstream:"Records",action:"File signed training confirmations",priority:"Medium",owner:"Rafet",dueDate:"2026-09-09",status:"Not started",note:""},
    {id:"AT-004",workstream:"Leave",action:"Review pending leave requests",priority:"High",owner:"Rafet",dueDate:"2026-09-08",status:"Not started",note:"Two requests pending"},
    {id:"AT-005",workstream:"Reporting",action:"Prepare weekly staffing summary",priority:"Medium",owner:"Rafet",dueDate:"2026-09-11",status:"Not started",note:""},
    {id:"AT-006",workstream:"Meetings",action:"Prepare agenda and room checklist",priority:"Medium",owner:"Rafet",dueDate:"2026-09-10",status:"Complete",note:"Shared with team"},
    {id:"AT-007",workstream:"Onboarding",action:"Check starter documentation",priority:"High",owner:"Rafet",dueDate:"2026-09-09",status:"In progress",note:"One form outstanding"},
    {id:"AT-008",workstream:"Compliance",action:"Update monthly compliance log",priority:"Medium",owner:"Rafet",dueDate:"2026-09-12",status:"Not started",note:""},
    {id:"AT-009",workstream:"Communication",action:"Send rota publication notice",priority:"Low",owner:"Rafet",dueDate:"2026-09-11",status:"Not started",note:""}
  ]
};
