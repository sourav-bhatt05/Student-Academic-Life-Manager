document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // CONSTANTS & STATE
    // ============================================
    const CREDS = { u: 'student', p: 'password123' };
    let isAuth = false;
    let activeTabId = 'dashboard';
    let chartInstance = null;
    let pomTimer = null;
    let pomState = { mode: 'work', timeLeft: 25 * 60, running: false, sessions: 0, totalSessions: 4 };
    let activeNoteKey = null;
    let isDark = localStorage.getItem('sh-theme') === 'dark';

    // ============================================
    // ICONS
    // ============================================
    const I = {
        dashboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        timetable: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        assignments: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
        quiz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        attendance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        events: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
        notes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        gpa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        pomodoro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
        trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    };

    // ============================================
    // DATA
    // ============================================
    const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    const timetableData = [
        { day: 'Monday',    slots: ['P-DBMS (PDN) CL3_2','P-DBMS (PDN) CL3_2','L-HS (TNS) CR12','L-DBMS A17 (PDN) LT3','','L-MA A17 (SST) CR10','L-OOPS A17 (HRI) CR6'] },
        { day: 'Tuesday',   slots: ['L-PY A17 (RMS) CR1','L-MA A17 (SST) CR2','P-DBMS A17 (PDN) CL8_2','P-DBMS A17 (PDN) CL8_2','','L-OOPS A17 (HRI) CR9','P-OOPS A17 (HRI) CL3_1'] },
        { day: 'Wednesday', slots: ['','P-DBMS (PDN) CR9','P-PY A17 (VKB) CL3_1','P-PY A17 (VKB) CL3_1','','L-PY A17 (RMS) LT3','P-OOPS A17 (HRI) CL5_1'] },
        { day: 'Thursday',  slots: ['','','L-PY A17 (RMS)','L-HS A17 (TNS) LT3','','L-OOPS A17 (HRI) CR6',''] },
        { day: 'Friday',    slots: ['MATLAB (MSD) CL3_2','MATLAB (MSD) CL3_2','P-PY A17 (VKB) CL9_1','P-PY A17 (VKB) CL9_1','','L-DBMS A17 (PDN) CR8','T-HS A17 (ANJ) TR3','L-MA-SST LT3'] },
        { day: 'Saturday',  slots: ['','','','','','','',''] },
    ];

    const defaultAssignments = [
        { id: 1, title: 'Math Assignment 1',   due: '2025-05-10', subject: 'Maths',   details: 'Complete exercises 1-5 from chapter 3.', done: false },
        { id: 2, title: 'Physics Lab Report',   due: '2025-05-12', subject: 'Physics', details: 'Submit report on pendulum experiment.',    done: false },
        { id: 3, title: 'DBMS Project Phase 1', due: '2025-05-20', subject: 'DBMS',    details: 'ER Diagram and Schema Design.',            done: false },
    ];

    const defaultAttendance = [
        { subject: 'OOPS',           percentage: 76   },
        { subject: 'OOPS Lab',       percentage: 78.8 },
        { subject: 'IT Workshop Lab',percentage: 91.7 },
        { subject: 'Maths',          percentage: 96.6 },
        { subject: 'Statistics',     percentage: 84.7 },
        { subject: 'Stats Lab',      percentage: 91.7 },
    ];

    const eventsList = [
        '📚 Classes Begin: July 24, 2025',
        '📝 Mid-Sem Exams (Odd): September 16–21, 2025',
        '🎓 End-Sem Exams (Odd): December 16–21, 2025',
        '🖥️ Project Viva (Odd): December 4–6, 2025',
        '📅 Supplementary Exams (Odd): January 16–18, 2025',
        '📚 Classes Begin (Even): January 15, 2026',
        '📝 Mid-Sem Exams (Even): March 10–15, 2026',
        '🖥️ Project Viva (Even): May 20–22, 2026',
        '🎓 End-Sem Exams (Even): May 26–31, 2026',
        '📊 Result Declaration (Odd): December 30, 2025',
        '📊 Result Declaration (Even): June 15, 2026',
    ];

    const defaultGpaRows = [
        { name: 'Mathematics',    credits: 4, grade: 'A' },
        { name: 'DBMS',           credits: 3, grade: 'A+'},
        { name: 'OOPS',           credits: 3, grade: 'B+'},
        { name: 'Python',         credits: 3, grade: 'A' },
        { name: 'Humanities',     credits: 2, grade: 'B' },
        { name: 'DBMS Lab',       credits: 2, grade: 'A+'},
        { name: 'OOPS Lab',       credits: 2, grade: 'A' },
        { name: 'Python Lab',     credits: 2, grade: 'A' },
    ];

    const GRADE_POINTS = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'D': 4, 'F': 0 };

    // Load persisted data
    let assignments = loadData('sh-assignments', defaultAssignments);
    let attendance  = loadData('sh-attendance', defaultAttendance);
    let gpaRows     = loadData('sh-gpa', defaultGpaRows);

    // Tab config
    const tabsConfig = [
        { id: 'dashboard',   icon: I.dashboard,   label: 'Dashboard',    render: renderDashboard   },
        { id: 'timetable',   icon: I.timetable,   label: 'Timetable',    render: renderTimetable   },
        { id: 'assignments', icon: I.assignments,  label: 'Assignments',  render: renderAssignments },
        { id: 'quiz',        icon: I.quiz,         label: 'Quizzes',      render: renderQuiz        },
        { id: 'attendance',  icon: I.attendance,   label: 'Attendance',   render: renderAttendance  },
        { id: 'events',      icon: I.events,       label: 'Events',       render: renderEvents      },
        { id: 'notes',       icon: I.notes,        label: 'Notes',        render: renderNotes       },
        { id: 'gpa',         icon: I.gpa,          label: 'GPA Calc',     render: renderGpa         },
        { id: 'pomodoro',    icon: I.pomodoro,     label: 'Pomodoro',     render: renderPomodoro    },
    ];

    // Quiz state
    let quizState = { subject: '', questions: [], index: 0, score: 0, answered: false, finished: false };
    const quizBank = {
        'DBMS': [
            { q: 'What does DBMS stand for?', opts: ['Database Management System','Data Business Model Set','Digital Binary Management','None'], ans: 'Database Management System' },
            { q: 'Which SQL command retrieves data?', opts: ['INSERT','UPDATE','SELECT','DELETE'], ans: 'SELECT' },
            { q: 'What is a Primary Key?', opts: ['A unique identifier for each row','A foreign reference','An index type','None'], ans: 'A unique identifier for each row' },
            { q: 'Full form of SQL?', opts: ['Structured Query Language','Simple Query Logic','Stored Query Layer','None'], ans: 'Structured Query Language' },
        ],
        'OOPS': [
            { q: 'What is Encapsulation?', opts: ['Hiding implementation details','Inheriting from parent','Runtime polymorphism','Storing arrays'], ans: 'Hiding implementation details' },
            { q: 'Which keyword creates an object in Java?', opts: ['create','new','make','object'], ans: 'new' },
            { q: 'OOPS stands for?', opts: ['Object Oriented Programming System','Object Oriented Paradigm','Only One Process','None'], ans: 'Object Oriented Programming System' },
            { q: 'Which pillar allows code reuse via parent-child?', opts: ['Encapsulation','Polymorphism','Inheritance','Abstraction'], ans: 'Inheritance' },
        ],
        'MA': [
            { q: 'Derivative of sin(x)?', opts: ['cos(x)','-cos(x)','sin(x)','tan(x)'], ans: 'cos(x)' },
            { q: 'Value of π (approx)?', opts: ['3.14','2.71','1.61','3.00'], ans: '3.14' },
            { q: 'Integration of x dx?', opts: ['x²/2 + C','2x + C','x + C','x²'], ans: 'x²/2 + C' },
            { q: 'What is the rank of a matrix?', opts: ['Max linearly independent rows','Determinant','Trace','None'], ans: 'Max linearly independent rows' },
        ],
        'PY': [
            { q: 'Which function prints output in Python?', opts: ['echo()','print()','log()','write()'], ans: 'print()' },
            { q: 'Python is a __ language?', opts: ['Compiled','Interpreted','Assembly','Machine'], ans: 'Interpreted' },
            { q: 'What keyword starts a function?', opts: ['func','def','fn','function'], ans: 'def' },
            { q: 'List is __?', opts: ['Immutable','Mutable','Static','None'], ans: 'Mutable' },
        ],
        'HS': [
            { q: 'Who wrote "The Wealth of Nations"?', opts: ['Karl Marx','Adam Smith','Keynes','Darwin'], ans: 'Adam Smith' },
            { q: 'What does GDP stand for?', opts: ['Gross Domestic Product','General Data Protocol','Growth of Development Projects','None'], ans: 'Gross Domestic Product' },
            { q: 'Which is a soft skill?', opts: ['Coding','Communication','Database design','Algorithm'], ans: 'Communication' },
        ],
    };

    // ============================================
    // DOM
    // ============================================
    const loginPage   = document.getElementById('login-page');
    const appPage     = document.getElementById('app-page');
    const loginForm   = document.getElementById('login-form');
    const loginError  = document.getElementById('login-error');
    const tabsList    = document.getElementById('tabs-list');
    const tabsContent = document.getElementById('tabs-content-area');
    const themeBtn    = document.getElementById('theme-toggle');
    const iconMoon    = document.getElementById('icon-moon');
    const iconSun     = document.getElementById('icon-sun');

    // ============================================
    // INIT
    // ============================================
    function init() {
        applyTheme(isDark);
        startClock();
        loginForm.addEventListener('submit', handleLogin);
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        themeBtn.addEventListener('click', () => { isDark = !isDark; localStorage.setItem('sh-theme', isDark ? 'dark' : 'light'); applyTheme(isDark); });
    }

    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        iconMoon.style.display = dark ? 'none' : 'block';
        iconSun.style.display  = dark ? 'block' : 'none';
    }

    function startClock() {
        const el = document.getElementById('live-clock');
        if (!el) return;
        function tick() {
            const now = new Date();
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            el.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} · ${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
        }
        tick();
        setInterval(tick, 1000);
    }

    // ============================================
    // AUTH
    // ============================================
    function handleLogin(e) {
        e.preventDefault();
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value;
        if (u === CREDS.u && p === CREDS.p) {
            isAuth = true;
            loginError.style.display = 'none';
            loginPage.classList.add('hidden'); loginPage.classList.remove('active');
            appPage.classList.remove('hidden'); appPage.classList.add('active');
            renderTabsList();
            activateTab('dashboard');
            toast('Welcome back, Sourav! 👋', 'success');
        } else {
            loginError.textContent = 'Incorrect username or password.';
            loginError.style.display = 'block';
        }
    }

    function handleLogout() {
        isAuth = false;
        if (pomTimer) { clearInterval(pomTimer); pomTimer = null; }
        tabsList.innerHTML = ''; tabsContent.innerHTML = '';
        appPage.classList.add('hidden'); appPage.classList.remove('active');
        loginPage.classList.remove('hidden'); loginPage.classList.add('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    // ============================================
    // TABS
    // ============================================
    function renderTabsList() {
        tabsList.innerHTML = '';
        tabsConfig.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = 'tab-trigger';
            btn.dataset.id = tab.id;
            btn.innerHTML = `${tab.icon}<span>${tab.label}</span>`;
            btn.addEventListener('click', () => activateTab(tab.id));
            tabsList.appendChild(btn);
        });
    }

    function activateTab(id) {
        activeTabId = id;
        tabsList.querySelectorAll('.tab-trigger').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.id === id);
        });
        const cfg = tabsConfig.find(t => t.id === id);
        if (!cfg) return;

        tabsContent.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'tab-card';

        // Section header
        const hdr = document.createElement('div');
        hdr.className = 'content-section-header';
        hdr.innerHTML = `<div class="content-section-icon">${cfg.icon}</div><h2 class="content-section-title">${cfg.label}</h2>`;
        card.appendChild(hdr);

        const body = document.createElement('div');
        cfg.render(body);
        card.appendChild(body);

        tabsContent.appendChild(card);
    }

    // ============================================
    // DASHBOARD
    // ============================================
    function renderDashboard(c) {
        // Stat cards
        const statRow = document.createElement('div');
        statRow.className = 'stat-cards-row';
        const todayAttendanceAvg = Math.round(attendance.reduce((s, a) => s + a.percentage, 0) / attendance.length);
        const doneAssignments = assignments.filter(a => a.done).length;
        const stats = [
            { icon: '🎓', label: 'CGPA', value: '8.5', change: '↑ Trending up' },
            { icon: '📈', label: 'SGPA', value: '8.7', change: '↑ +0.3 vs last sem' },
            { icon: `${doneAssignments}/${assignments.length}`, label: 'Assignments Done', value: `${doneAssignments}`, change: `of ${assignments.length} total` },
            { icon: '📊', label: 'Avg Attendance', value: `${todayAttendanceAvg}%`, change: todayAttendanceAvg >= 75 ? '✅ On track' : '⚠️ Below 75%' },
        ];
        stats.forEach(s => {
            const el = document.createElement('div');
            el.className = 'stat-card';
            el.innerHTML = `<div class="stat-card-icon">${s.icon}</div>
                <div class="stat-card-label">${s.label}</div>
                <div class="stat-card-value">${s.value}</div>
                <div class="stat-card-change">${s.change}</div>`;
            statRow.appendChild(el);
        });
        c.appendChild(statRow);

        // Today's schedule
        const todayIdx = new Date().getDay(); // 0=Sun
        const todayName = DAYS[todayIdx];
        const todayData = timetableData.find(d => d.day === todayName);
        if (todayData) {
            const todaySec = document.createElement('div');
            todaySec.className = 'today-schedule';
            todaySec.innerHTML = `<div class="today-schedule-title">📅 Today's Classes — ${todayName}</div>`;
            const slotsGrid = document.createElement('div');
            slotsGrid.className = 'today-slots';
            let hasClasses = false;
            todayData.slots.forEach((slot, i) => {
                if (!slot || !slot.trim()) return;
                hasClasses = true;
                const isLunch = i === 4;
                const parsed = parseSlot(slot);
                const div = document.createElement('div');
                div.className = 'today-slot';
                div.innerHTML = `<div class="today-slot-type">Slot ${i + 1}${parsed.type ? ' · ' + parsed.type : ''}</div>
                    <div class="today-slot-subject">${parsed.subject}</div>
                    <div class="today-slot-room">${parsed.details}</div>`;
                slotsGrid.appendChild(div);
            });
            if (!hasClasses) {
                slotsGrid.innerHTML = `<div style="color:var(--text-secondary);font-size:.875rem;padding:.5rem 0;">No classes today 🎉</div>`;
            }
            todaySec.appendChild(slotsGrid);
            c.appendChild(todaySec);
        }

        // Info grid
        const info = [
            'Student: Sourav Bhatt', 'Degree: B.Tech CSE', 'Year: 3rd Year',
            'Semester: 6th Sem', 'Roll No: A-17', 'Batch: 2022–2026'
        ];
        const grid = document.createElement('div');
        grid.className = 'dashboard-grid';
        info.forEach(txt => {
            const item = document.createElement('div');
            item.className = 'dashboard-item';
            item.textContent = txt;
            grid.appendChild(item);
        });
        c.appendChild(grid);
    }

    // ============================================
    // TIMETABLE
    // ============================================
    function renderTimetable(c) {
        const todayName = DAYS[new Date().getDay()];
        const wrap = document.createElement('div');
        wrap.className = 'timetable-wrap';
        const table = document.createElement('table');
        table.className = 'timetable-table';

        let maxSlots = 0;
        timetableData.forEach(d => { if (d.slots.length > maxSlots) maxSlots = d.slots.length; });

        const thead = document.createElement('thead');
        let thHTML = '<tr><th>Day</th>';
        for (let i = 0; i < maxSlots; i++) thHTML += `<th>Slot ${i + 1}</th>`;
        thHTML += '</tr>';
        thead.innerHTML = thHTML;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        timetableData.forEach(dayEntry => {
            const row = document.createElement('tr');
            if (dayEntry.day === todayName) row.classList.add('today-row');
            row.innerHTML = `<td>${dayEntry.day}${dayEntry.day === todayName ? ' 📍' : ''}</td>`;
            for (let i = 0; i < maxSlots; i++) {
                const slot = dayEntry.slots[i] || '';
                const cell = document.createElement('td');
                const isEmpty = !slot.trim();
                const isLunch = i === 4 && isEmpty && dayEntry.day !== 'Saturday';
                if (dayEntry.day === 'Saturday') cell.classList.add('slot-saturday');
                else if (isLunch) cell.classList.add('slot-lunch');
                else if (isEmpty) cell.classList.add('slot-empty');
                else if (slot.startsWith('P-')) cell.classList.add('slot-practical');
                else if (slot.startsWith('L-')) cell.classList.add('slot-lecture');
                else if (slot.startsWith('T-')) cell.classList.add('slot-tutorial');
                else if (slot.includes('MATLAB')) cell.classList.add('slot-matlab');

                if (isEmpty) {
                    cell.innerHTML = `<span class="${isLunch ? 'slot-lunch-text' : 'slot-empty-text'}">${isLunch ? '🍽️ LUNCH' : '—'}</span>`;
                } else {
                    const p = parseSlot(slot);
                    cell.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                        ${p.type ? `<div class="slot-type-badge">${p.type}</div>` : ''}
                        <div class="slot-subject">${p.subject}</div>
                        ${p.details ? `<div class="slot-details">${p.details}</div>` : ''}
                    </div>`;
                }
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        c.appendChild(wrap);
    }

    function parseSlot(slot) {
        const m = slot.match(/^([PLT])\s*-\s*([A-Z0-9\-]+)\s*(.*)/i);
        if (m) {
            const typeMap = { P: 'Practical', L: 'Lecture', T: 'Tutorial' };
            return { type: typeMap[m[1].toUpperCase()] || '', subject: m[2], details: m[3].trim() };
        }
        const m2 = slot.match(/^([A-Z0-9\-]+)\s*(.*)/i);
        if (m2) return { type: '', subject: m2[1], details: m2[2].trim() };
        return { type: '', subject: slot, details: '' };
    }

    // ============================================
    // ASSIGNMENTS
    // ============================================
    function renderAssignments(c) {
        // Input refs (created before appending so we can closure over them)
        const titleInput   = document.createElement('input');
        const dueInput     = document.createElement('input');
        const subjectInput = document.createElement('input');
        const addBtn       = document.createElement('button');

        titleInput.className   = 'assign-input'; titleInput.placeholder   = 'Assignment title';
        dueInput.className     = 'assign-input'; dueInput.type            = 'date';
        subjectInput.className = 'assign-input'; subjectInput.placeholder = 'Subject';
        addBtn.className = 'add-assign-btn'; addBtn.textContent = '+ Add';

        const col1 = document.createElement('div');
        col1.innerHTML = '<div class="assign-field-label">Title</div>';
        col1.appendChild(titleInput);

        const col2 = document.createElement('div');
        col2.innerHTML = '<div class="assign-field-label">Due Date &amp; Subject</div>';
        col2.appendChild(dueInput);
        subjectInput.style.marginTop = '.5rem';
        col2.appendChild(subjectInput);

        const form = document.createElement('div');
        form.className = 'assignments-add-form';
        form.appendChild(col1);
        form.appendChild(col2);
        form.appendChild(addBtn);
        c.appendChild(form);

        const list = document.createElement('div');
        list.className = 'assignments-list';
        c.appendChild(list);

        addBtn.addEventListener('click', () => {
            const t = titleInput.value.trim();
            const d = dueInput.value;
            const s = subjectInput.value.trim();
            if (!t) { toast('Enter a title!', 'error'); return; }
            assignments.push({ id: Date.now(), title: t, due: d || '—', subject: s || 'General', details: '', done: false });
            saveData('sh-assignments', assignments);
            renderAssignmentsList(list);
            titleInput.value = ''; subjectInput.value = ''; dueInput.value = '';
            toast('Assignment added! ✅', 'success');
        });

        renderAssignmentsList(list);
    }

    function renderAssignmentsList(list) {
        list.innerHTML = '';
        if (assignments.length === 0) {
            list.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:2rem;font-size:.875rem;">No assignments yet 🎉</div>`;
            return;
        }
        [...assignments].sort((a,b) => a.done - b.done).forEach(a => {
            const item = document.createElement('div');
            item.className = 'assignment-item' + (a.done ? ' done' : '');
            item.innerHTML = `
                <button class="assignment-check" data-id="${a.id}" title="Mark done">${a.done ? I.check : ''}</button>
                <div class="assignment-body">
                    <div class="assignment-header">
                        <span class="assignment-title">${a.title}</span>
                        <span class="assignment-subject-badge">${a.subject}</span>
                    </div>
                    <div class="assignment-due">📅 Due: ${a.due}</div>
                    ${a.details ? `<div class="assignment-details">${a.details}</div>` : ''}
                </div>
                <button class="assignment-delete" data-id="${a.id}" title="Delete">${I.trash}</button>
            `;
            item.querySelector('.assignment-check').addEventListener('click', () => {
                a.done = !a.done;
                saveData('sh-assignments', assignments);
                renderAssignmentsList(list);
                toast(a.done ? 'Assignment marked done! ✅' : 'Marked undone.', 'info');
            });
            item.querySelector('.assignment-delete').addEventListener('click', () => {
                assignments = assignments.filter(x => x.id !== a.id);
                saveData('sh-assignments', assignments);
                renderAssignmentsList(list);
                toast('Assignment deleted.', 'warning');
            });
            list.appendChild(item);
        });
    }

    // ============================================
    // QUIZ
    // ============================================
    function renderQuiz(c) {
        const subjects = Object.keys(quizBank);

        const label = document.createElement('label');
        label.className = 'quiz-select-label';
        label.textContent = 'Choose a Subject:';
        c.appendChild(label);

        const sel = document.createElement('select');
        sel.className = 'quiz-select';

        const defaultOpt = document.createElement('option');
        defaultOpt.value = ''; defaultOpt.textContent = '— Select a Subject —';
        sel.appendChild(defaultOpt);

        subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s; opt.textContent = s;
            sel.appendChild(opt);
        });

        // Restore previously selected subject
        if (quizState.subject && subjects.includes(quizState.subject)) {
            sel.value = quizState.subject;
        }
        c.appendChild(sel);

        const quizArea = document.createElement('div');
        quizArea.style.marginTop = '1.25rem';
        c.appendChild(quizArea);

        sel.addEventListener('change', () => {
            const subj = sel.value;
            if (!subj) { quizArea.innerHTML = ''; return; }
            const qs = quizBank[subj];
            if (!qs || qs.length === 0) { quizArea.innerHTML = '<div class="quiz-no-questions">No questions for this subject yet.</div>'; return; }
            quizState = { subject: subj, questions: [...qs], index: 0, score: 0, answered: false, finished: false };
            showQuizQuestion(quizArea);
        });

        // Restore in-progress quiz
        if (quizState.subject && quizState.questions.length > 0) {
            if (quizState.finished) showQuizResults(quizArea);
            else showQuizQuestion(quizArea);
        }
    }

    function showQuizQuestion(area) {
        area.innerHTML = '';
        const q = quizState.questions[quizState.index];
        if (!q) { quizState.finished = true; showQuizResults(area); return; }

        const card = document.createElement('div');
        card.className = 'quiz-question-card';

        const total = quizState.questions.length;
        const pct = Math.round(((quizState.index) / total) * 100);
        card.innerHTML = `
            <div class="quiz-progress-bar-wrap"><div class="quiz-progress-bar" style="width:${pct}%"></div></div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.875rem;">
                <span style="font-size:.75rem;font-weight:700;color:var(--text-muted);font-family:'Outfit',sans-serif;text-transform:uppercase;letter-spacing:.06em;">
                    Question ${quizState.index + 1} / ${total}
                </span>
                <span style="font-size:.8rem;font-weight:700;color:var(--primary);font-family:'Outfit',sans-serif;">Score: ${quizState.score}</span>
            </div>
            <div class="quiz-question-text">${q.q}</div>
        `;

        const opts = document.createElement('div');
        opts.className = 'quiz-options';

        q.opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt;
            btn.disabled = quizState.answered;
            btn.addEventListener('click', () => {
                if (quizState.answered) return;
                quizState.answered = true;
                const correct = opt === q.ans;
                if (correct) { quizState.score++; btn.classList.add('correct'); toast('Correct! 🎉', 'success'); }
                else { btn.classList.add('incorrect'); toast(`Correct: ${q.ans}`, 'error'); }
                opts.querySelectorAll('.quiz-option-btn').forEach(b => {
                    if (b.textContent === q.ans) b.classList.add('correct');
                    b.disabled = true;
                });
                nextBtn.disabled = false;
            });
            opts.appendChild(btn);
        });
        card.appendChild(opts);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'quiz-next-btn';
        nextBtn.textContent = quizState.index === total - 1 ? 'Finish Quiz 🏁' : 'Next →';
        nextBtn.disabled = true;
        nextBtn.addEventListener('click', () => {
            quizState.index++;
            quizState.answered = false;
            if (quizState.index >= total) { quizState.finished = true; showQuizResults(area); }
            else showQuizQuestion(area);
        });
        card.appendChild(nextBtn);
        area.appendChild(card);
    }

    function showQuizResults(area) {
        area.innerHTML = '';
        const pct = Math.round((quizState.score / quizState.questions.length) * 100);
        const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
        const msg   = pct >= 80 ? 'Excellent Work!' : pct >= 60 ? 'Good Job!' : 'Keep Practicing!';
        const div = document.createElement('div');
        div.className = 'quiz-results';
        div.innerHTML = `
            <div class="quiz-results-emoji">${emoji}</div>
            <div class="quiz-results-title">Quiz Complete!</div>
            <div class="quiz-results-score">${quizState.score}/${quizState.questions.length}</div>
            <div class="quiz-results-label">${pct}% — ${msg}</div>
        `;
        const retake = document.createElement('button');
        retake.className = 'quiz-retake-btn';
        retake.textContent = 'Retake Quiz';
        retake.addEventListener('click', () => {
            quizState = { ...quizState, index: 0, score: 0, answered: false, finished: false, questions: [...quizBank[quizState.subject]] };
            showQuizQuestion(area);
        });
        div.appendChild(retake);
        area.appendChild(div);
    }

    // ============================================
    // ATTENDANCE
    // ============================================
    function renderAttendance(c) {
        const grid = document.createElement('div');
        grid.className = 'attendance-grid';

        // Chart card
        const chartCard = document.createElement('div');
        chartCard.className = 'attendance-card';
        chartCard.innerHTML = `<div class="attendance-card-title">📊 Attendance Overview</div>`;
        const chartWrap = document.createElement('div');
        chartWrap.style.cssText = 'position:relative;height:260px;';
        const canvas = document.createElement('canvas');
        canvas.id = 'attendancePieChart';
        chartWrap.appendChild(canvas);
        chartCard.appendChild(chartWrap);
        grid.appendChild(chartCard);

        // List card
        const listCard = document.createElement('div');
        listCard.className = 'attendance-card';
        listCard.innerHTML = `<div class="attendance-card-title">📋 Subject-wise (click to update)</div>`;
        const listWrap = document.createElement('div');

        const renderList = () => {
            listWrap.innerHTML = '';
            attendance.forEach(item => {
                const cls = item.percentage >= 75 ? 'good' : item.percentage >= 60 ? 'warning' : 'danger';
                const row = document.createElement('div');
                row.className = 'attendance-row';
                row.title = 'Click to edit attendance';
                row.innerHTML = `
                    <span class="attendance-subject-name">${item.subject}</span>
                    <div class="attendance-bar-wrap"><div class="attendance-bar-fill ${cls}" style="width:${item.percentage}%"></div></div>
                    <span class="attendance-pct ${cls}">${item.percentage}%</span>
                `;
                row.addEventListener('click', () => {
                    const val = prompt(`Update attendance for ${item.subject} (0–100):`, item.percentage);
                    if (val === null) return;
                    const num = parseFloat(val);
                    if (isNaN(num) || num < 0 || num > 100) { toast('Please enter 0–100.', 'error'); return; }
                    item.percentage = Math.round(num * 10) / 10;
                    saveData('sh-attendance', attendance);
                    renderList();
                    updateChart();
                    toast(`${item.subject} updated to ${item.percentage}%`, 'info');
                });
                listWrap.appendChild(row);
            });
            listWrap.innerHTML += `<p class="attendance-edit-hint">💡 Click a row to update attendance</p>`;
        };

        listCard.appendChild(listWrap);
        renderList();
        grid.appendChild(listCard);
        c.appendChild(grid);

        // Chart.js
        if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
        const ctx = canvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: attendance.map(d => d.subject),
                datasets: [{ data: attendance.map(d => d.percentage),
                    backgroundColor: ['rgba(108,99,255,0.85)','rgba(16,185,129,0.85)','rgba(245,158,11,0.85)','rgba(236,72,153,0.85)','rgba(59,130,246,0.85)','rgba(139,92,246,0.85)'],
                    borderColor: 'rgba(0,0,0,0.1)', borderWidth: 2, hoverOffset: 6 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '62%',
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 11, family: 'Outfit' }, padding: 12, usePointStyle: true } },
                    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
                }
            }
        });

        function updateChart() {
            chartInstance.data.datasets[0].data = attendance.map(d => d.percentage);
            chartInstance.update();
        }
    }

    // ============================================
    // EVENTS
    // ============================================
    function renderEvents(c) {
        const list = document.createElement('div');
        list.className = 'events-list';
        eventsList.forEach(txt => {
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `<div class="event-dot"></div><span>${txt}</span>`;
            list.appendChild(item);
        });
        c.appendChild(list);
    }

    // ============================================
    // NOTES
    // ============================================
    function renderNotes(c) {
        let noteKeys = loadData('sh-note-keys', ['General', 'Maths', 'DBMS']);
        if (!activeNoteKey || !noteKeys.includes(activeNoteKey)) activeNoteKey = noteKeys[0];

        const grid = document.createElement('div');
        grid.className = 'notes-grid';

        // Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'notes-sidebar';

        // Editor
        const editorArea = document.createElement('div');
        editorArea.className = 'notes-editor-area';

        let saveTimeout;

        const renderEditor = () => {
            editorArea.innerHTML = '';
            const noteContent = localStorage.getItem('sh-note-' + activeNoteKey) || '';
            const hdr = document.createElement('div');
            hdr.className = 'notes-editor-header';
            const titleEl = document.createElement('div');
            titleEl.className = 'notes-editor-title';
            titleEl.textContent = '📓 ' + activeNoteKey;
            const badge = document.createElement('span');
            badge.className = 'notes-saved-badge';
            badge.textContent = '✓ Saved';
            hdr.appendChild(titleEl);
            hdr.appendChild(badge);
            editorArea.appendChild(hdr);

            const ta = document.createElement('textarea');
            ta.className = 'notes-textarea';
            ta.placeholder = `Start typing your ${activeNoteKey} notes here...`;
            ta.value = noteContent;
            ta.addEventListener('input', () => {
                badge.classList.remove('show');
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    localStorage.setItem('sh-note-' + activeNoteKey, ta.value);
                    badge.classList.add('show');
                    setTimeout(() => badge.classList.remove('show'), 2000);
                }, 600);
            });
            editorArea.appendChild(ta);
        };

        const renderSidebar = () => {
            sidebar.innerHTML = '<div class="notes-sidebar-title">📝 Notebooks</div>';
            noteKeys.forEach(key => {
                const btn = document.createElement('button');
                btn.className = 'note-tab-btn' + (key === activeNoteKey ? ' active' : '');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = key;
                const delBtn = document.createElement('button');
                delBtn.className = 'note-delete-btn';
                delBtn.textContent = '✕';
                delBtn.addEventListener('click', ev => {
                    ev.stopPropagation();
                    if (noteKeys.length <= 1) { toast("Can't delete last notebook!", 'error'); return; }
                    noteKeys = noteKeys.filter(k => k !== key);
                    localStorage.removeItem('sh-note-' + key);
                    saveData('sh-note-keys', noteKeys);
                    if (activeNoteKey === key) activeNoteKey = noteKeys[0];
                    renderSidebar();
                    renderEditor();
                    toast(`Deleted "${key}"`, 'warning');
                });
                btn.appendChild(nameSpan);
                btn.appendChild(delBtn);
                btn.addEventListener('click', ev => {
                    if (ev.target === delBtn) return;
                    activeNoteKey = key;
                    renderSidebar();
                    renderEditor();
                });
                sidebar.appendChild(btn);
            });

            // Add new notebook row
            const addRow = document.createElement('div');
            addRow.className = 'notes-add-input-row';
            const newInput = document.createElement('input');
            newInput.className = 'notes-add-input';
            newInput.placeholder = 'New notebook...';
            const newBtn = document.createElement('button');
            newBtn.className = 'notes-add-btn';
            newBtn.textContent = '+';
            newBtn.addEventListener('click', () => {
                const name = newInput.value.trim();
                if (!name) return;
                if (noteKeys.includes(name)) { toast('Notebook already exists.', 'warning'); return; }
                noteKeys.push(name);
                saveData('sh-note-keys', noteKeys);
                activeNoteKey = name;
                newInput.value = '';
                renderSidebar();
                renderEditor();
                toast(`Notebook "${name}" created!`, 'success');
            });
            addRow.appendChild(newInput);
            addRow.appendChild(newBtn);
            sidebar.appendChild(addRow);
        };

        renderSidebar();
        renderEditor();

        grid.appendChild(sidebar);
        grid.appendChild(editorArea);
        c.appendChild(grid);
    }

    // ============================================
    // GPA CALCULATOR
    // ============================================
    function renderGpa(c) {
        const banner = document.createElement('div');
        banner.className = 'gpa-result-banner';
        banner.id = 'gpa-banner';
        c.appendChild(banner);

        const tableWrap = document.createElement('div');
        tableWrap.className = 'gpa-table-wrap';
        const table = document.createElement('table');
        table.className = 'gpa-table';
        table.innerHTML = `<thead><tr><th>Subject</th><th>Credits</th><th>Grade</th><th>Points</th></tr></thead>`;
        const tbody = document.createElement('tbody');
        tbody.id = 'gpa-tbody';
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        c.appendChild(tableWrap);

        const addBtn = document.createElement('button');
        addBtn.className = 'gpa-add-row-btn';
        addBtn.textContent = '+ Add Subject';
        addBtn.addEventListener('click', () => {
            gpaRows.push({ name: '', credits: 3, grade: 'A' });
            renderGpaRows();
        });
        c.appendChild(addBtn);

        const renderGpaRows = () => {
            const tb = document.getElementById('gpa-tbody');
            if (!tb) return;
            tb.innerHTML = '';
            gpaRows.forEach((row, idx) => {
                const tr = document.createElement('tr');
                const gradeOpts = Object.keys(GRADE_POINTS).map(g => `<option value="${g}" ${g === row.grade ? 'selected' : ''}>${g} (${GRADE_POINTS[g]})</option>`).join('');
                tr.innerHTML = `
                    <td><input class="gpa-input" value="${row.name}" placeholder="Subject name"></td>
                    <td><input class="gpa-input" type="number" min="1" max="6" value="${row.credits}" style="width:60px"></td>
                    <td><select class="gpa-select">${gradeOpts}</select></td>
                    <td class="gpa-points-cell">${GRADE_POINTS[row.grade]}</td>
                `;
                tr.querySelectorAll('.gpa-input')[0].addEventListener('input', e => { gpaRows[idx].name = e.target.value; saveData('sh-gpa', gpaRows); });
                tr.querySelectorAll('.gpa-input')[1].addEventListener('input', e => { gpaRows[idx].credits = parseInt(e.target.value) || 1; saveData('sh-gpa', gpaRows); calcGpa(); });
                tr.querySelector('.gpa-select').addEventListener('change', e => {
                    gpaRows[idx].grade = e.target.value;
                    tr.querySelector('.gpa-points-cell').textContent = GRADE_POINTS[e.target.value];
                    saveData('sh-gpa', gpaRows);
                    calcGpa();
                });
                tb.appendChild(tr);
            });
            calcGpa();
        };

        const calcGpa = () => {
            let totalPoints = 0, totalCredits = 0;
            gpaRows.forEach(r => {
                const cr = parseInt(r.credits) || 0;
                const pts = GRADE_POINTS[r.grade] ?? 0;
                totalPoints += cr * pts;
                totalCredits += cr;
            });
            const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '—';
            const banner = document.getElementById('gpa-banner');
            if (!banner) return;
            banner.innerHTML = `
                <div class="gpa-result-card"><div class="gpa-result-label">SGPA</div><div class="gpa-result-value">${sgpa}</div></div>
                <div class="gpa-result-card"><div class="gpa-result-label">Total Credits</div><div class="gpa-result-value">${totalCredits}</div></div>
                <div class="gpa-result-card"><div class="gpa-result-label">Grade Points</div><div class="gpa-result-value">${totalPoints}</div></div>
            `;
        };

        renderGpaRows();
    }

    // ============================================
    // POMODORO TIMER
    // ============================================
    function renderPomodoro(c) {
        const MODES = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
        const CIRC = 2 * Math.PI * 90;

        if (!pomState.running && pomState.timeLeft === 0) {
            pomState = { mode: 'work', timeLeft: MODES.work, running: false, sessions: 0, totalSessions: 4 };
        }

        const cont = document.createElement('div');
        cont.className = 'pomodoro-container';

        // Mode buttons
        const modeBtns = document.createElement('div');
        modeBtns.className = 'pomodoro-mode-btns';
        [['work','🍅 Focus'], ['short','☕ Short Break'], ['long','🌙 Long Break']].forEach(([m, label]) => {
            const btn = document.createElement('button');
            btn.className = 'pomodoro-mode-btn' + (pomState.mode === m ? ' active' : '');
            btn.textContent = label;
            btn.addEventListener('click', () => {
                if (pomTimer) { clearInterval(pomTimer); pomTimer = null; }
                pomState.mode = m; pomState.timeLeft = MODES[m]; pomState.running = false;
                activateTab('pomodoro');
            });
            modeBtns.appendChild(btn);
        });
        cont.appendChild(modeBtns);

        // Ring
        const ringWrap = document.createElement('div');
        ringWrap.className = 'pomodoro-ring-wrap';
        ringWrap.innerHTML = `
            <svg class="pomodoro-svg" width="220" height="220" viewBox="0 0 220 220">
                <defs>
                    <linearGradient id="pomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#6C63FF"/>
                        <stop offset="100%" style="stop-color:#8B5CF6"/>
                    </linearGradient>
                </defs>
                <circle class="pomodoro-ring-bg" cx="110" cy="110" r="90"/>
                <circle class="pomodoro-ring-fill" id="pom-ring" cx="110" cy="110" r="90" stroke-dasharray="${CIRC}" stroke-dashoffset="0"/>
            </svg>
            <div class="pomodoro-time-text" id="pom-time">${formatTime(pomState.timeLeft)}</div>
            <div class="pomodoro-label-text" id="pom-label">${pomState.mode === 'work' ? 'FOCUS' : 'BREAK'}</div>
        `;
        cont.appendChild(ringWrap);

        const updateRing = () => {
            const total = MODES[pomState.mode];
            const progress = pomState.timeLeft / total;
            const offset = CIRC * (1 - progress);
            const ring = document.getElementById('pom-ring');
            const timeEl = document.getElementById('pom-time');
            const labelEl = document.getElementById('pom-label');
            if (ring) ring.style.strokeDashoffset = offset;
            if (timeEl) timeEl.textContent = formatTime(pomState.timeLeft);
            if (labelEl) labelEl.textContent = pomState.mode === 'work' ? 'FOCUS' : 'BREAK';
        };

        // Controls
        const controls = document.createElement('div');
        controls.className = 'pomodoro-controls';

        const startBtn = document.createElement('button');
        startBtn.className = 'pomodoro-btn primary';
        startBtn.textContent = pomState.running ? '⏸ Pause' : '▶ Start';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'pomodoro-btn secondary';
        resetBtn.textContent = '↺ Reset';

        startBtn.addEventListener('click', () => {
            if (pomState.running) {
                clearInterval(pomTimer); pomTimer = null;
                pomState.running = false;
                startBtn.textContent = '▶ Start';
            } else {
                pomState.running = true;
                startBtn.textContent = '⏸ Pause';
                pomTimer = setInterval(() => {
                    pomState.timeLeft--;
                    updateRing();
                    if (pomState.timeLeft <= 0) {
                        clearInterval(pomTimer); pomTimer = null;
                        pomState.running = false;
                        if (pomState.mode === 'work') { pomState.sessions++; }
                        const msg = pomState.mode === 'work' ? '⏰ Focus session done! Take a break!' : '⏰ Break over! Back to work!';
                        toast(msg, 'success');
                        pomState.mode = pomState.mode === 'work' ? 'short' : 'work';
                        pomState.timeLeft = MODES[pomState.mode];
                        startBtn.textContent = '▶ Start';
                        updateRing();
                        updateDots();
                    }
                }, 1000);
            }
        });

        resetBtn.addEventListener('click', () => {
            clearInterval(pomTimer); pomTimer = null;
            pomState.timeLeft = MODES[pomState.mode]; pomState.running = false;
            startBtn.textContent = '▶ Start';
            updateRing();
        });

        controls.appendChild(startBtn);
        controls.appendChild(resetBtn);
        cont.appendChild(controls);

        // Session dots
        const sessInfo = document.createElement('div');
        sessInfo.style.textAlign = 'center';
        sessInfo.innerHTML = `<div class="pomodoro-session-count">🍅 Sessions completed: <b>${pomState.sessions}</b> / ${pomState.totalSessions}</div>`;
        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'pomodoro-session-dots';
        dotsWrap.id = 'pom-dots';
        sessInfo.appendChild(dotsWrap);
        cont.appendChild(sessInfo);

        const updateDots = () => {
            const dw = document.getElementById('pom-dots');
            if (!dw) return;
            dw.innerHTML = '';
            for (let i = 0; i < pomState.totalSessions; i++) {
                const dot = document.createElement('div');
                dot.className = 'pomodoro-dot' + (i < pomState.sessions ? ' done' : '');
                dw.appendChild(dot);
            }
        };
        updateDots();
        updateRing();

        c.appendChild(cont);
    }

    // ============================================
    // UTILITIES
    // ============================================
    function toast(msg, type = 'info') {
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        const icons = { success: '✅', error: '❌', info: '💡', warning: '⚠️' };
        el.innerHTML = `<span>${icons[type] || '💡'}</span><span>${msg}</span>`;
        document.getElementById('toast-container').appendChild(el);
        setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 350); }, 3500);
    }

    function pad(n) { return String(n).padStart(2, '0'); }
    function formatTime(s) { return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }
    function saveData(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }
    function loadData(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e) { return def; } }

    // ============================================
    // START
    // ============================================
    init();
});
