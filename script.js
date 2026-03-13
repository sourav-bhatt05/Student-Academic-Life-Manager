document.addEventListener('DOMContentLoaded', () => {
    // --- SVG Icons ---
    const icons = {
        LayoutDashboard: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>`,
        Clock: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
        ClipboardList: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>`,
        Star: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
        Users: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        Calendar: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        LockKeyhole: `<svg class="w-10 h-10" style="color:var(--primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>`
    };

    // --- Constants and State ---
    const DUMMY_USERNAME = "student";
    const DUMMY_PASSWORD = "password123";
    let isAuthenticated = false;
    let activeTabId = 'dashboard';
    let attendanceChartInstance = null;

    // --- Data ---
    const timetableData = [
        { day: 'Monday', slots: ['P-DBMS (PDN) CL3_2', 'P-DBMS (PDN) CL3_2', 'L-HS (TNS) CR12', 'L-DBMS A17 (PDN) LT3', '', 'L-MA A17 (SST) CR10', 'L-OOPS A17 (HRI) CR6'] },
        { day: 'Tuesday', slots: ['L-PY A17 (RMS) CR1', 'L-MA A17 (SST) CR2', 'P-DBMS A17 (PDN) CL8_2', 'P-DBMS A17 (PDN) CL8_2', '', 'L-OOPS A17 (HRI) CR9', 'P-OOPS A17 (HRI) CL3_1'] },
        { day: 'Wednesday', slots: ['', 'P-DBMS (PDN) CR9', 'P-PY A17 (VKB) CL3_1', 'P-PY A17 (VKB) CL3_1', '', 'L-PY A17 (RMS) LT3', 'P-OOPS A17 (HRI) CL5_1'] },
        { day: 'Thursday', slots: ['', '', 'L-PY A17 (RMS)', 'L-HS A17 (TNS) LT3', '', 'L-OOPS A17 (HRI) CR6', ''] },
        { day: 'Friday', slots: ['MATLAB (MSD) CL3_2', 'MATLAB (MSD) CL3_2', 'P-PY A17 (VKB) CL9_1', 'P-PY A17 (VKB) CL9_1', '', 'L-DBMS A17 (PDN) CR8', 'T-HS A17 (ANJ) TR3', 'L-MA-SST LT3'] },
        { day: 'Saturday', slots: ['', '', '', '', '', '', '', ''] },
    ];
    const assignmentsData = [
        { title: 'Math Assignment 1', due: '2025-05-10', subject: 'Maths', details: 'Complete exercises 1-5 from chapter 3.' },
        { title: 'Physics Lab Report', due: '2025-05-12', subject: 'Physics', details: 'Submit report on pendulum experiment.' },
        { title: 'DBMS Project Phase 1', due: '2025-05-20', subject: 'DBMS', details: 'ER Diagram and Schema Design.' },
    ];
    const subjectList = extractSubjectsFromTimetable(timetableData);
    let quizDataStore = generateQuizData(subjectList);
    const eventDetailsData = [
        'Classes Begin: July 24, 2025', 'Mid-Sem Exams (Odd): September 16–21, 2025',
        'End-Sem Exams (Odd): December 16–21, 2025', 'Project Viva (Odd): December 4–6, 2025',
        'Supplementary Exams (Odd): January 16–18, 2025', 'Classes Begin (Even): January 15, 2026',
        'Mid-Sem Exams (Even): March 10–15, 2026', 'Project Viva (Even): May 20–22, 2026',
        'End-Sem Exams (Even): May 26–31, 2026', 'Result Declaration (Odd): December 30, 2025',
        'Result Declaration (Even): June 15, 2026'
    ];
    const dashboardData = [
        'Student Name: Sourav Bhatt', 'Degree: B.Tech', 'Year: 3rd Year', 'Semester: 6th Sem',
        'CGPA: 8.5 (Example)', 'SGPA: 8.7 (Example)', 'Welcome to your academic dashboard!'
    ];
    const attendanceChartData = [
        { subject: "OOPS", percentage: 76 }, { subject: "OOPS Lab", percentage: 78.8 },
        { subject: "IT Workshop Lab", percentage: 91.7 }, { subject: "Maths", percentage: 96.6 },
        { subject: "Statistics", percentage: 84.7 }, { subject: "Statistics Lab", percentage: 91.7 },
    ];

    const tabsConfig = [
        { id: 'dashboard', icon: icons.LayoutDashboard, label: 'Dashboard', image: 'https://source.unsplash.com/800x300/?workspace,desk,study', data: dashboardData, renderFunc: renderListContent },
        { id: 'timetable', icon: icons.Clock, label: 'Timetable', image: 'https://source.unsplash.com/800x300/?calendar,schedule,time', data: timetableData, renderFunc: renderTimetableContent },
        { id: 'assignments', icon: icons.ClipboardList, label: 'Assignments', image: 'https://source.unsplash.com/800x300/?notebook,tasks,checklist', data: assignmentsData, renderFunc: renderAssignmentsContent },
        { id: 'quiz', icon: icons.Star, label: 'Quizzes', image: 'https://source.unsplash.com/800x300/?quiz,test,knowledge', data: { subjects: subjectList, quizData: quizDataStore }, renderFunc: renderQuizContent },
        { id: 'attendance', icon: icons.Users, label: 'Attendance', image: 'https://source.unsplash.com/800x300/?classroom,students,attendance', data: attendanceChartData, renderFunc: renderAttendanceContent },
        { id: 'events', icon: icons.Calendar, label: 'Events', image: 'https://source.unsplash.com/800x300/?campus,event,university', data: eventDetailsData, renderFunc: renderListContent },
    ];

    // --- DOM Elements ---
    const loginPage = document.getElementById('login-page');
    const loginIconContainer = document.getElementById('login-icon-container');
    const appPage = document.getElementById('app-page');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const tabsListEl = document.getElementById('tabs-list');
    const tabsContentAreaEl = document.getElementById('tabs-content-area');

    // --- Initialization ---
    function init() {
        if (loginIconContainer) loginIconContainer.innerHTML = icons.LockKeyhole;
        setupEventListeners();
        updatePageView();
        if (isAuthenticated) {
            renderTabs();
            activateTab(activeTabId);
        }
    }

    function setupEventListeners() {
        loginForm.addEventListener('submit', handleLogin);
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }

    function handleLogout() {
        isAuthenticated = false;
        activeTabId = 'dashboard';
        tabsListEl.innerHTML = '';
        tabsContentAreaEl.innerHTML = '';
        updatePageView();
    }

    function updatePageView() {
        if (isAuthenticated) {
            loginPage.classList.add('hidden');
            loginPage.classList.remove('active');
            appPage.classList.remove('hidden');
            appPage.classList.add('active');
        } else {
            loginPage.classList.remove('hidden');
            loginPage.classList.add('active');
            appPage.classList.add('hidden');
            appPage.classList.remove('active');
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
            isAuthenticated = true;
            loginError.classList.add('hidden');
            loginError.textContent = '';
            activeTabId = 'dashboard';
            updatePageView();
            renderTabs();
            activateTab(activeTabId);
        } else {
            isAuthenticated = false;
            loginError.textContent = 'Invalid username or password. Hint: student / password123';
            loginError.style.display = 'block';
            updatePageView();
        }
    }

    function renderTabs() {
        tabsListEl.innerHTML = '';
        tabsConfig.forEach(tab => {
            const trigger = document.createElement('button');
            trigger.className = 'tab-trigger';
            trigger.dataset.tabId = tab.id;
            trigger.innerHTML = `${tab.icon} <span>${tab.label}</span>`;
            trigger.addEventListener('click', () => activateTab(tab.id));
            tabsListEl.appendChild(trigger);
        });
    }

    function activateTab(tabId) {
        activeTabId = tabId;
        document.querySelectorAll('.tab-trigger').forEach(btn => {
            if (btn.dataset.tabId === tabId) {
                btn.setAttribute('data-active', 'true');
                btn.style.background = 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)';
                btn.style.color = 'white';
                btn.style.boxShadow = '0 2px 10px rgba(79,70,229,0.30)';
            } else {
                btn.removeAttribute('data-active');
                btn.style.background = '';
                btn.style.color = '';
                btn.style.boxShadow = '';
            }
        });
        const tabConfig = tabsConfig.find(t => t.id === tabId);
        if (tabConfig) renderTabContent(tabConfig);
    }

    function renderTabContent(tabConfig) {
        tabsContentAreaEl.innerHTML = '';
        const cardDiv = document.createElement('div');
        cardDiv.className = 'tab-card';

        // Section header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'content-section-header';
        const iconEl = document.createElement('div');
        iconEl.className = 'content-section-icon';
        iconEl.innerHTML = tabConfig.icon.replace('w-5 h-5', 'w-6 h-6');
        const titleEl = document.createElement('h2');
        titleEl.className = 'content-section-title';
        titleEl.textContent = tabConfig.label;
        headerDiv.appendChild(iconEl);
        headerDiv.appendChild(titleEl);
        cardDiv.appendChild(headerDiv);

        // Banner image
        if (tabConfig.image) {
            const img = document.createElement('img');
            img.src = tabConfig.image;
            img.alt = `${tabConfig.label} visual`;
            img.className = 'content-banner';
            cardDiv.appendChild(img);
        }

        // Body
        const bodyDiv = document.createElement('div');
        tabConfig.renderFunc(bodyDiv, tabConfig.data);
        cardDiv.appendChild(bodyDiv);

        tabsContentAreaEl.appendChild(cardDiv);
    }

    // ============================================
    // RENDER: LIST (Dashboard & Events)
    // ============================================
    function renderListContent(container, dataList) {
        const tabId = tabsConfig.find(t => t.data === dataList)?.id;

        // Dashboard gets stat cards + grid
        if (dataList === dashboardData) {
            // Mini stat cards
            const statsRow = document.createElement('div');
            statsRow.className = 'stat-cards-row';
            const stats = [
                { label: 'CGPA', value: '8.5', change: '↑ 0.2 this sem' },
                { label: 'SGPA', value: '8.7', change: '↑ 0.3 vs last sem' },
                { label: 'Semester', value: '4th Sem', change: 'B.Tech · 2nd Year' },
            ];
            stats.forEach(s => {
                const card = document.createElement('div');
                card.className = 'stat-card';
                card.innerHTML = `<div class="stat-card-label">${s.label}</div>
                                  <div class="stat-card-value">${s.value}</div>
                                  <div class="stat-card-change">${s.change}</div>`;
                statsRow.appendChild(card);
            });
            container.appendChild(statsRow);

            // Info grid
            const grid = document.createElement('div');
            grid.className = 'dashboard-grid';
            dataList.forEach(itemText => {
                const item = document.createElement('div');
                item.className = 'dashboard-item';
                item.textContent = itemText;
                grid.appendChild(item);
            });
            container.appendChild(grid);
        } else {
            // Events list
            const list = document.createElement('div');
            list.className = 'events-list';
            dataList.forEach(itemText => {
                const item = document.createElement('div');
                item.className = 'event-item';
                item.innerHTML = `<div class="event-dot"></div><span>${itemText}</span>`;
                list.appendChild(item);
            });
            container.appendChild(list);
        }
    }

    // ============================================
    // RENDER: ASSIGNMENTS
    // ============================================
    function renderAssignmentsContent(container, assignments) {
        const list = document.createElement('div');
        list.className = 'assignments-list';
        assignments.forEach(a => {
            const item = document.createElement('div');
            item.className = 'assignment-item';
            item.innerHTML = `
                <div class="assignment-header">
                    <span class="assignment-title">${a.title}</span>
                    <span class="assignment-subject-badge">${a.subject}</span>
                </div>
                <div class="assignment-due">📅 Due: ${a.due}</div>
                <div class="assignment-details">${a.details}</div>
            `;
            list.appendChild(item);
        });
        container.appendChild(list);
    }

    // ============================================
    // RENDER: TIMETABLE
    // ============================================
    function renderTimetableContent(container, timetableData) {
        const wrap = document.createElement('div');
        wrap.className = 'timetable-wrap';

        const table = document.createElement('table');
        table.className = 'timetable-table';

        // Head
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>Day</th>`;
        let maxSlots = 0;
        timetableData.forEach(day => { if (day.slots.length > maxSlots) maxSlots = day.slots.length; });
        for (let i = 0; i < maxSlots; i++) {
            headerRow.innerHTML += `<th>Slot ${i + 1}</th>`;
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        timetableData.forEach(dayEntry => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${dayEntry.day}</td>`;
            for (let i = 0; i < maxSlots; i++) {
                const slotContent = dayEntry.slots[i] || '';
                const cell = document.createElement('td');
                const isEmptySlot = !slotContent.trim();
                const isPresumedLunch = i === 4 && isEmptySlot && dayEntry.day !== 'Saturday';

                if (dayEntry.day === 'Saturday' && isEmptySlot) cell.classList.add('slot-saturday');
                else if (isPresumedLunch) cell.classList.add('slot-lunch');
                else if (isEmptySlot) cell.classList.add('slot-empty');
                else if (slotContent.startsWith('P-')) cell.classList.add('slot-practical');
                else if (slotContent.startsWith('L-')) cell.classList.add('slot-lecture');
                else if (slotContent.startsWith('T-')) cell.classList.add('slot-tutorial');
                else if (slotContent.includes('MATLAB')) cell.classList.add('slot-matlab');

                let cellHTML = '';
                if (isEmptySlot) {
                    cellHTML = `<span class="${isPresumedLunch ? 'slot-lunch-text' : 'slot-empty-text'}">${isPresumedLunch ? 'LUNCH' : '—'}</span>`;
                } else {
                    let typeText = '', mainSubjectText = slotContent, detailsText = '';
                    const typePrefixMatch = slotContent.match(/^([PLT])\s*-\s*([A-Z0-9\-]+.*)/i);
                    const fullSubjectMatch = slotContent.match(/^([A-Z0-9\-]+)\s*(.*)/i);
                    if (typePrefixMatch) {
                        if (typePrefixMatch[1].toUpperCase() === 'P') typeText = 'Practical';
                        else if (typePrefixMatch[1].toUpperCase() === 'L') typeText = 'Lecture';
                        else if (typePrefixMatch[1].toUpperCase() === 'T') typeText = 'Tutorial';
                        const restContent = typePrefixMatch[2];
                        const subjectDetailSplit = restContent.match(/^([A-Z0-9\-]+)\s*(.*)/i);
                        if (subjectDetailSplit) { mainSubjectText = subjectDetailSplit[1]; detailsText = subjectDetailSplit[2].trim(); }
                        else { mainSubjectText = restContent; }
                    } else if (fullSubjectMatch) {
                        mainSubjectText = fullSubjectMatch[1]; detailsText = fullSubjectMatch[2].trim();
                    }
                    cellHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">`;
                    if (typeText) cellHTML += `<div class="slot-type-badge">${typeText}</div>`;
                    cellHTML += `<div class="slot-subject">${mainSubjectText}</div>`;
                    if (detailsText) cellHTML += `<div class="slot-details">${detailsText}</div>`;
                    cellHTML += `</div>`;
                }
                cell.innerHTML = cellHTML;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        container.appendChild(wrap);
    }

    // ============================================
    // QUIZ LOGIC
    // ============================================
    let currentQuiz = { subject: '', questions: [], index: 0, score: 0, selectedOption: null, finished: false };

    function renderQuizContent(container, data) {
        container.innerHTML = '';

        const selectLabel = document.createElement('label');
        selectLabel.htmlFor = 'quiz-subject-select';
        selectLabel.className = 'quiz-select-label';
        selectLabel.textContent = 'Choose a Subject:';
        container.appendChild(selectLabel);

        const subjectSelect = document.createElement('select');
        subjectSelect.id = 'quiz-subject-select';
        subjectSelect.className = 'quiz-select';
        subjectSelect.innerHTML = '<option value="">Select a Subject</option>';
        data.subjects.forEach(s => {
            const option = document.createElement('option');
            option.value = s; option.textContent = s;
            subjectSelect.appendChild(option);
        });
        subjectSelect.value = currentQuiz.subject;
        subjectSelect.addEventListener('change', (e) => startNewQuiz(e.target.value, data.quizData, container));
        container.appendChild(subjectSelect);

        const quizArea = document.createElement('div');
        quizArea.id = 'quiz-question-area';
        quizArea.style.marginTop = '1.25rem';
        container.appendChild(quizArea);

        if (currentQuiz.subject && currentQuiz.questions.length > 0 && !currentQuiz.finished) {
            displayCurrentQuizQuestion(quizArea);
        } else if (currentQuiz.subject && currentQuiz.finished) {
            displayQuizResults(quizArea);
        }
    }

    function startNewQuiz(subject, allQuizData, mainContainer) {
        currentQuiz.subject = subject;
        const quizArea = mainContainer.querySelector('#quiz-question-area');
        if (!quizArea) return;
        if (!subject) { quizArea.innerHTML = ''; return; }
        currentQuiz.questions = allQuizData[subject] || [];
        currentQuiz.index = 0;
        currentQuiz.score = 0;
        currentQuiz.selectedOption = null;
        currentQuiz.finished = false;
        displayCurrentQuizQuestion(quizArea);
    }

    function displayCurrentQuizQuestion(quizArea) {
        quizArea.innerHTML = '';
        if (currentQuiz.questions.length === 0 || currentQuiz.index >= currentQuiz.questions.length) {
            const msg = document.createElement('div');
            msg.className = 'quiz-no-questions';
            msg.textContent = currentQuiz.questions.length === 0
                ? `No quiz questions available for ${currentQuiz.subject}.`
                : 'Quiz ended.';
            quizArea.appendChild(msg);
            if (currentQuiz.questions.length > 0) currentQuiz.finished = true;
            return;
        }

        const q = currentQuiz.questions[currentQuiz.index];
        const questionContainer = document.createElement('div');
        questionContainer.className = 'quiz-question-card';

        if (q.bg) {
            const img = document.createElement('img');
            img.src = q.bg;
            img.alt = `${currentQuiz.subject} visual`;
            img.className = 'quiz-question-img';
            questionContainer.appendChild(img);
        }

        // Progress indicator
        const progress = document.createElement('div');
        progress.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;';
        progress.innerHTML = `
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);font-family:'Plus Jakarta Sans',sans-serif;text-transform:uppercase;letter-spacing:0.06em;">
                Question ${currentQuiz.index + 1} of ${currentQuiz.questions.length}
            </span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--primary);font-family:'Plus Jakarta Sans',sans-serif;">
                Score: ${currentQuiz.score}
            </span>
        `;
        questionContainer.appendChild(progress);

        const questionText = document.createElement('h3');
        questionText.className = 'quiz-question-text';
        questionText.textContent = q.question;
        questionContainer.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'quiz-options';
        q.options.forEach((optText) => {
            const optButton = document.createElement('button');
            optButton.className = 'quiz-option-btn';
            optButton.textContent = optText;
            optButton.addEventListener('click', () => {
                currentQuiz.selectedOption = optText;
                optionsDiv.querySelectorAll('.quiz-option-btn').forEach(btn => btn.classList.remove('selected'));
                optButton.classList.add('selected');
                const nextBtn = questionContainer.querySelector('.quiz-next-btn');
                if (nextBtn) nextBtn.disabled = false;
            });
            optionsDiv.appendChild(optButton);
        });
        questionContainer.appendChild(optionsDiv);

        const nextButton = document.createElement('button');
        nextButton.className = 'quiz-next-btn';
        nextButton.textContent = (currentQuiz.index === currentQuiz.questions.length - 1) ? 'Finish Quiz' : 'Next Question →';
        nextButton.disabled = currentQuiz.selectedOption === null;
        nextButton.addEventListener('click', () => handleQuizNext(quizArea));
        questionContainer.appendChild(nextButton);

        quizArea.appendChild(questionContainer);
    }

    function handleQuizNext(quizArea) {
        if (currentQuiz.selectedOption === null) return;
        const q = currentQuiz.questions[currentQuiz.index];
        if (currentQuiz.selectedOption === q.answer) currentQuiz.score++;
        currentQuiz.index++;
        currentQuiz.selectedOption = null;
        if (currentQuiz.index < currentQuiz.questions.length) {
            displayCurrentQuizQuestion(quizArea);
        } else {
            currentQuiz.finished = true;
            displayQuizResults(quizArea);
        }
    }

    function displayQuizResults(quizArea) {
        quizArea.innerHTML = '';
        const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'quiz-results';
        resultsDiv.innerHTML = `
            <div class="quiz-results-title">Quiz Complete! 🎉</div>
            <div class="quiz-results-score">${currentQuiz.score}/${currentQuiz.questions.length}</div>
            <div class="quiz-results-label">${percentage}% — ${percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}</div>
        `;
        const retakeButton = document.createElement('button');
        retakeButton.className = 'quiz-retake-btn';
        retakeButton.textContent = 'Retake Quiz';
        retakeButton.addEventListener('click', () => startNewQuiz(currentQuiz.subject, quizDataStore, quizArea.parentElement));
        resultsDiv.appendChild(retakeButton);
        quizArea.appendChild(resultsDiv);
    }

    // ============================================
    // RENDER: ATTENDANCE
    // ============================================
    function renderAttendanceContent(container, attendanceData) {
        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'attendance-grid';

        // Chart card
        const chartCard = document.createElement('div');
        chartCard.className = 'attendance-chart-card';
        const chartTitle = document.createElement('div');
        chartTitle.className = 'attendance-list-title';
        chartTitle.textContent = 'Attendance Overview';
        chartCard.appendChild(chartTitle);
        const chartWrap = document.createElement('div');
        chartWrap.style.cssText = 'position:relative;height:280px;';
        const canvas = document.createElement('canvas');
        canvas.id = 'attendancePieChart';
        chartWrap.appendChild(canvas);
        chartCard.appendChild(chartWrap);
        grid.appendChild(chartCard);

        // List card
        const listCard = document.createElement('div');
        listCard.className = 'attendance-list-card';
        const listTitle = document.createElement('div');
        listTitle.className = 'attendance-list-title';
        listTitle.textContent = 'Subject-wise Attendance';
        listCard.appendChild(listTitle);

        attendanceData.forEach(item => {
            const pctClass = item.percentage >= 75 ? 'good' : item.percentage >= 60 ? 'warning' : 'danger';
            const row = document.createElement('div');
            row.className = 'attendance-row';
            row.innerHTML = `
                <span class="attendance-subject-name">${item.subject}</span>
                <div class="attendance-bar-wrap">
                    <div class="attendance-bar-fill ${pctClass}" style="width:${item.percentage}%"></div>
                </div>
                <span class="attendance-pct ${pctClass}">${item.percentage}%</span>
            `;
            listCard.appendChild(row);
        });
        grid.appendChild(listCard);
        container.appendChild(grid);

        // Chart.js
        if (attendanceChartInstance) attendanceChartInstance.destroy();
        const ctx = canvas.getContext('2d');
        attendanceChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: attendanceData.map(d => d.subject),
                datasets: [{
                    label: 'Attendance %',
                    data: attendanceData.map(d => d.percentage),
                    backgroundColor: [
                        'rgba(79, 70, 229, 0.85)',
                        'rgba(16, 185, 129, 0.85)',
                        'rgba(245, 158, 11, 0.85)',
                        'rgba(236, 72, 153, 0.85)',
                        'rgba(59, 130, 246, 0.85)',
                        'rgba(124, 58, 237, 0.85)',
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 11, family: 'Plus Jakarta Sans' }, padding: 16, usePointStyle: true }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
                        }
                    }
                }
            }
        });
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    function extractSubjectsFromTimetable(timetable) {
        const subjects = new Set();
        timetable.forEach(({ slots }) => {
            slots.forEach(slot => {
                if (slot && slot.trim() !== '') {
                    const match = slot.match(/[A-Z\-]+/g);
                    if (match && match.length > 0) subjects.add(match[0]);
                }
            });
        });
        return Array.from(subjects);
    }

    function generateQuizData(subjects) {
        const sampleQuestions = [
            { question: 'What does DBMS stand for?', options: ['Database Management System', 'Data Business Model Set', 'Digital Binary Management', 'None of the above'], answer: 'Database Management System' },
            { question: 'Which language is primarily used for Object-Oriented Programming?', options: ['Python', 'Java', 'C++', 'All of the above'], answer: 'All of the above' },
            { question: 'What is the core concept of "Encapsulation" in OOP?', options: ['Hiding complex implementation details', 'Inheriting properties from parent classes', 'Executing code at runtime', 'Storing data in arrays'], answer: 'Hiding complex implementation details' }
        ];
        const quizzes = {};
        subjects.forEach((subj) => {
            const imageQuery = subj.split('-').pop();
            quizzes[subj] = sampleQuestions.map(q => ({ ...q, bg: `https://source.unsplash.com/600x300/?${imageQuery},technology,study` }));
        });
        return quizzes;
    }

    // --- Start ---
    init();
});
