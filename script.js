document.addEventListener('DOMContentLoaded', () => {
    // --- SVG Icons ---
    const icons = {
        LayoutDashboard: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>`,
        Clock: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
        ClipboardList: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>`,
        Star: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
        Users: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        Calendar: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        LockKeyhole: `<svg class="w-10 h-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>`
    };

    // --- Constants and State ---
    const DUMMY_USERNAME = "student";
    const DUMMY_PASSWORD = "password123";
    let isAuthenticated = false;
    let activeTabId = 'dashboard';
    let attendanceChartInstance = null;

    // --- Data ---
    const timetableData = [ /* same as before */
        { day: 'Monday', slots: ['P-DBMS (PDN) CL3_2', 'P-DBMS (PDN) CL3_2', 'L-HS (TNS) CR12', 'L-DBMS A17 (PDN) LT3', '', 'L-MA A17 (SST) CR10', 'L-OOPS A17 (HRI) CR6'] },
        { day: 'Tuesday', slots: ['L-PY A17 (RMS) CR1', 'L-MA A17 (SST) CR2', 'P-DBMS A17 (PDN) CL8_2', 'P-DBMS A17 (PDN) CL8_2', '', 'L-OOPS A17 (HRI) CR9', 'P-OOPS A17 (HRI) CL3_1'] },
        { day: 'Wednesday', slots: ['', 'P-DBMS (PDN) CR9', 'P-PY A17 (VKB) CL3_1', 'P-PY A17 (VKB) CL3_1', '', 'L-PY A17 (RMS) LT3', 'P-OOPS A17 (HRI) CL5_1'] },
        { day: 'Thursday', slots: ['', '', 'L-PY A17 (RMS)', 'L-HS A17 (TNS) LT3', '', 'L-OOPS A17 (HRI) CR6', ''] },
        { day: 'Friday', slots: ['MATLAB (MSD) CL3_2', 'MATLAB (MSD) CL3_2', 'P-PY A17 (VKB) CL9_1', 'P-PY A17 (VKB) CL9_1', '', 'L-DBMS A17 (PDN) CR8', 'T-HS A17 (ANJ) TR3', 'L-MA-SST LT3'] },
        { day: 'Saturday', slots: ['', '', '', '', '', '', '', ''] },
    ];
    const assignmentsData = [ /* same as before */
        { title: 'Math Assignment 1', due: '2025-05-10', subject: 'Maths', details: 'Complete exercises 1-5 from chapter 3.' },
        { title: 'Physics Lab Report', due: '2025-05-12', subject: 'Physics', details: 'Submit report on pendulum experiment.' },
        { title: 'DBMS Project Phase 1', due: '2025-05-20', subject: 'DBMS', details: 'ER Diagram and Schema Design.' },
    ];
    const subjectList = extractSubjectsFromTimetable(timetableData);
    let quizDataStore = generateQuizData(subjectList);
    const eventDetailsData = [ /* same as before */
        'Classes Begin: July 24, 2024', 'Mid-Sem Exams (Odd): September 16–21, 2024',
        'End-Sem Exams (Odd): December 16–21, 2024', 'Project Viva (Odd): December 4–6, 2024',
        'Supplementary Exams (Odd): January 16–18, 2025', 'Classes Begin (Even): January 15, 2025',
        'Mid-Sem Exams (Even): March 10–15, 2025', 'Project Viva (Even): May 20–22, 2025',
        'End-Sem Exams (Even): May 26–31, 2025', 'Result Declaration (Odd): December 30, 2024',
        'Result Declaration (Even): June 15, 2025'
    ];
    const dashboardData = [ /* same as before */
        'Student Name: Seharsh Thakur', 'Degree: B.Tech', 'Year: 2nd Year', 'Semester: 4th Sem',
        'CGPA: 8.5 (Example)', 'SGPA: 8.7 (Example)', 'Welcome to your academic dashboard!'
    ];
    const attendanceChartData = [ /* same as before */
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
        loginIconContainer.innerHTML = icons.LockKeyhole;
        setupEventListeners();
        updatePageView();
        if (isAuthenticated) { // If already authenticated (e.g. from local storage in a real app)
            renderTabs();
            activateTab(activeTabId);
        }
    }

    function setupEventListeners() {
        loginForm.addEventListener('submit', handleLogin);
    }

    function updatePageView() {
        if (isAuthenticated) {
            loginPage.classList.add('hidden');
            loginPage.classList.remove('active', 'flex');
            appPage.classList.remove('hidden');
            appPage.classList.add('active');
        } else {
            loginPage.classList.remove('hidden');
            loginPage.classList.add('active', 'flex'); // 'flex' for centering
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
            renderTabs(); // Render tabs only after successful login
            activateTab(activeTabId); // Activate default tab
        } else {
            isAuthenticated = false;
            loginError.textContent = 'Invalid username or password. Hint: student / password123';
            loginError.classList.remove('hidden');
            updatePageView();
        }
    }

    function renderTabs() {
        tabsListEl.innerHTML = '';
        tabsConfig.forEach(tab => {
            const trigger = document.createElement('button');
            // Tailwind classes for tab triggers
            trigger.className = `tab-trigger flex items-center space-x-2 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`;
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
                btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
                btn.classList.remove('hover:bg-indigo-200/70', 'text-gray-700');
            } else {
                btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
                btn.classList.add('hover:bg-indigo-200/70', 'text-gray-700'); // Assuming default text color
            }
        });
        const tabConfig = tabsConfig.find(t => t.id === tabId);
        if (tabConfig) renderTabContent(tabConfig);
    }

    function renderTabContent(tabConfig) {
        tabsContentAreaEl.innerHTML = ''; // Clear previous content
        // Tailwind classes for the main card container
        const cardDiv = document.createElement('div');
        cardDiv.className = 'tab-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-4xl mx-auto animate-fadeIn'; // Added fade-in animation (define in CSS if needed)
        
        const cardContentDiv = document.createElement('div');
        cardContentDiv.className = 'p-6 space-y-4';

        const cardHeaderDiv = document.createElement('div');
        cardHeaderDiv.className = 'flex items-center space-x-4';
        const iconContainer = document.createElement('div');
        iconContainer.className = 'text-indigo-600 p-1'; // Adjust icon size/color via Tailwind
        iconContainer.innerHTML = tabConfig.icon.replace('w-5 h-5', 'w-8 h-8'); // Make header icon larger
        
        cardHeaderDiv.appendChild(iconContainer);
        cardHeaderDiv.innerHTML += `<p class="text-xl font-semibold text-gray-700">${tabConfig.label}</p>`;
        cardContentDiv.appendChild(cardHeaderDiv);

        if (tabConfig.image) {
            const img = document.createElement('img');
            img.src = tabConfig.image;
            img.alt = `${tabConfig.label} visual`;
            img.className = 'w-full h-48 object-cover rounded-lg shadow-md';
            cardContentDiv.appendChild(img);
        }

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'pt-2 text-gray-600 text-sm sm:text-base';
        tabConfig.renderFunc(cardBodyDiv, tabConfig.data);
        cardContentDiv.appendChild(cardBodyDiv);

        cardDiv.appendChild(cardContentDiv);
        tabsContentAreaEl.appendChild(cardDiv);
    }

    function renderListContent(container, dataList) {
        const ul = document.createElement('ul');
        ul.className = 'list-disc pl-5 space-y-1.5'; // Tailwind for list styling
        dataList.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }
     function renderAssignmentsContent(container, assignments) {
        const ul = document.createElement('ul');
        ul.className = 'list-disc pl-5 space-y-3';
        assignments.forEach(a => {
            const li = document.createElement('li');
            li.className = "text-gray-700";
            li.innerHTML = `<span class="font-medium">${a.title} (${a.subject})</span> - Due: <span class="font-semibold text-indigo-600">${a.due}</span>.
                            <span class="block text-sm text-gray-500 mt-0.5">${a.details}</span>`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }


    function renderTimetableContent(container, timetableData) {
        const timetableContainer = document.createElement('div');
        // Tailwind for timetable container
        timetableContainer.className = 'overflow-x-auto bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200';
        const table = document.createElement('table');
        table.className = 'min-w-full divide-y divide-gray-300 border border-gray-300';

        const thead = document.createElement('thead');
        thead.className = 'bg-indigo-50 sticky top-0 z-10';
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th class="px-3 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider border-r border-gray-300 w-24 sm:w-32">Day</th>`;

        let maxSlots = 0;
        timetableData.forEach(day => { if (day.slots.length > maxSlots) maxSlots = day.slots.length; });
        for (let i = 0; i < maxSlots; i++) {
            headerRow.innerHTML += `<th class="px-2 py-3 text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider border-r border-gray-300 last:border-r-0 min-w-[100px] sm:min-w-[120px]">Slot ${i + 1}</th>`;
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        tbody.className = 'bg-white divide-y divide-gray-200';
        timetableData.forEach(dayEntry => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-indigo-50/50 transition-colors duration-150 even:bg-gray-50/50';
            row.innerHTML = `<td class="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800 border-r border-gray-300 w-24 sm:w-32">${dayEntry.day}</td>`;

            for (let i = 0; i < maxSlots; i++) {
                const slotContent = dayEntry.slots[i] || "";
                const cell = document.createElement('td');
                // Tailwind for cell and its content, dynamic background based on slot type
                let bgColor = "bg-white";
                const isEmptySlot = !slotContent.trim();
                const isPresumedLunch = i === 4 && isEmptySlot && dayEntry.day !== 'Saturday';

                if (dayEntry.day === 'Saturday' && isEmptySlot) bgColor = "bg-gray-100";
                else if (isPresumedLunch) bgColor = "bg-yellow-100";
                else if (isEmptySlot) bgColor = "bg-gray-50";
                else if (slotContent.startsWith('P-')) bgColor = "bg-blue-100";
                else if (slotContent.startsWith('L-')) bgColor = "bg-green-100";
                else if (slotContent.startsWith('T-')) bgColor = "bg-purple-100";
                else if (slotContent.includes('MATLAB')) bgColor = "bg-orange-100";

                cell.className = `px-2 py-3 whitespace-normal text-xs border-r border-gray-300 last:border-r-0 text-center min-w-[100px] sm:min-w-[120px] ${bgColor} transition-colors duration-150`;
                
                let cellHTML = '';
                if (isEmptySlot) {
                    cellHTML = `<span class="text-gray-400">${isPresumedLunch ? "LUNCH" : "-"}</span>`;
                } else {
                    let typeText = "", mainSubjectText = slotContent, detailsText = "";
                    // Simplified parsing logic (same as before, adjust if needed)
                    const typePrefixMatch = slotContent.match(/^([PLT])\s*-\s*([A-Z0-9\-]+.*)/i);
                    const fullSubjectMatch = slotContent.match(/^([A-Z0-9\-]+)\s*(.*)/i);
                    if (typePrefixMatch) {
                        if (typePrefixMatch[1].toUpperCase() === 'P') typeText = "Practical";
                        else if (typePrefixMatch[1].toUpperCase() === 'L') typeText = "Lecture";
                        else if (typePrefixMatch[1].toUpperCase() === 'T') typeText = "Tutorial";
                        const restContent = typePrefixMatch[2];
                        const subjectDetailSplit = restContent.match(/^([A-Z0-9\-]+)\s*(.*)/i);
                        if (subjectDetailSplit) { mainSubjectText = subjectDetailSplit[1]; detailsText = subjectDetailSplit[2].trim(); } 
                        else { mainSubjectText = restContent; }
                    } else if (fullSubjectMatch) {
                        mainSubjectText = fullSubjectMatch[1]; detailsText = fullSubjectMatch[2].trim();
                    }
                    cellHTML = `<div class="flex flex-col items-center justify-center h-full">`;
                    if(typeText) cellHTML += `<div class="text-[10px] text-gray-500 font-medium uppercase">${typeText}</div>`;
                    cellHTML += `<div class="font-semibold text-indigo-700 text-sm leading-tight my-0.5">${mainSubjectText}</div>`;
                    if(detailsText) cellHTML += `<div class="text-gray-600 text-[10px] leading-tight">${detailsText}</div>`;
                    cellHTML += `</div>`;
                }
                cell.innerHTML = cellHTML;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        timetableContainer.appendChild(table);
        container.appendChild(timetableContainer);
    }
    
    // --- Quiz Logic ---
    let currentQuiz = { subject: '', questions: [], index: 0, score: 0, selectedOption: null, finished: false };

    function renderQuizContent(container, data) {
        container.innerHTML = ''; // Clear previous
        container.className = 'space-y-6'; // Tailwind for spacing

        const selectLabel = document.createElement('label');
        selectLabel.htmlFor = 'quiz-subject-select';
        selectLabel.className = 'text-lg font-medium text-gray-800 block mb-1';
        selectLabel.textContent = 'Choose a Subject:';
        container.appendChild(selectLabel);

        const subjectSelect = document.createElement('select');
        subjectSelect.id = 'quiz-subject-select';
        subjectSelect.className = 'w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150';
        subjectSelect.innerHTML = '<option value="">Select a Subject</option>';
        data.subjects.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            subjectSelect.appendChild(option);
        });
        subjectSelect.value = currentQuiz.subject;
        subjectSelect.addEventListener('change', (e) => startNewQuiz(e.target.value, data.quizData, container));
        container.appendChild(subjectSelect);

        const quizArea = document.createElement('div');
        quizArea.id = 'quiz-question-area'; // Used to update this part
        container.appendChild(quizArea);

        // Initial render if a quiz was in progress
        if (currentQuiz.subject && currentQuiz.questions.length > 0 && !currentQuiz.finished) {
            displayCurrentQuizQuestion(quizArea);
        } else if (currentQuiz.subject && currentQuiz.finished) {
            displayQuizResults(quizArea);
        }
    }

    function startNewQuiz(subject, allQuizData, mainContainer) {
        currentQuiz.subject = subject;
        const quizArea = mainContainer.querySelector('#quiz-question-area'); // Get the quiz area within the current tab content
        if (!quizArea) return; // Should not happen if structure is correct

        if (!subject) {
            quizArea.innerHTML = ''; return;
        }
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
            quizArea.innerHTML = `<p class="text-gray-600 p-4 border rounded-lg bg-yellow-50 text-yellow-700">${currentQuiz.questions.length === 0 ? `No quiz questions for ${currentQuiz.subject}.` : 'Quiz ended.'}</p>`;
            if (currentQuiz.questions.length > 0) currentQuiz.finished = true;
            return;
        }

        const q = currentQuiz.questions[currentQuiz.index];
        // Tailwind for question container
        const questionContainer = document.createElement('div');
        questionContainer.className = 'p-4 border rounded-lg shadow-md bg-white animate-fadeInRight'; // Example animation

        if (q.bg) {
            const img = document.createElement('img');
            img.src = q.bg;
            img.alt = `${currentQuiz.subject} quiz visual`;
            img.className = 'w-full h-48 object-cover rounded-md mb-4 shadow';
            questionContainer.appendChild(img);
        }

        const questionText = document.createElement('h3');
        questionText.className = 'text-xl font-semibold text-gray-800 mb-3';
        questionText.textContent = q.question;
        questionContainer.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'space-y-2';
        q.options.forEach((optText, optIndex) => {
            const optButton = document.createElement('button');
            // Tailwind for option buttons
            optButton.className = `block w-full p-3 border rounded-md text-left transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-indigo-100 text-gray-700`;
            optButton.textContent = optText;
            optButton.addEventListener('click', () => {
                currentQuiz.selectedOption = optText;
                // Update selected style
                optionsDiv.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('bg-indigo-500', 'text-white', 'ring-2', 'ring-indigo-600');
                    btn.classList.add('bg-gray-50', 'hover:bg-indigo-100', 'text-gray-700');
                });
                optButton.classList.add('bg-indigo-500', 'text-white', 'ring-2', 'ring-indigo-600');
                optButton.classList.remove('bg-gray-50', 'hover:bg-indigo-100', 'text-gray-700');
                
                // Enable next button
                const nextBtn = questionContainer.querySelector('.quiz-next-button');
                if(nextBtn) nextBtn.disabled = false;

            });
            optionsDiv.appendChild(optButton);
        });
        questionContainer.appendChild(optionsDiv);

        const nextButton = document.createElement('button');
        nextButton.className = 'quiz-next-button mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 transition-colors duration-300 font-semibold';
        nextButton.textContent = (currentQuiz.index === currentQuiz.questions.length - 1) ? 'Finish Quiz' : 'Next Question';
        nextButton.disabled = currentQuiz.selectedOption === null;
        nextButton.addEventListener('click', () => handleQuizNext(quizArea));
        questionContainer.appendChild(nextButton);
        quizArea.appendChild(questionContainer);
    }
    
    function handleQuizNext(quizArea) {
        if (currentQuiz.selectedOption === null) return;
        const q = currentQuiz.questions[currentQuiz.index];
        if (currentQuiz.selectedOption === q.answer) {
            currentQuiz.score++;
        }
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
        const resultsDiv = document.createElement('div');
        // Tailwind for results
        resultsDiv.className = 'p-6 border rounded-lg shadow-xl bg-green-50 text-center animate-scaleUp'; // Example animation
        resultsDiv.innerHTML = `
            <h2 class="text-2xl font-bold text-green-700 mb-2">Quiz Completed!</h2>
            <p class="text-xl font-semibold text-green-600">
                You scored ${currentQuiz.score} / ${currentQuiz.questions.length}
            </p>
        `;
        const retakeButton = document.createElement('button');
        retakeButton.className = 'mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300';
        retakeButton.textContent = 'Retake Quiz';
        retakeButton.addEventListener('click', () => startNewQuiz(currentQuiz.subject, quizDataStore, quizArea.parentElement)); // Pass main container
        resultsDiv.appendChild(retakeButton);
        quizArea.appendChild(resultsDiv);
    }
    
    function renderAttendanceContent(container, attendanceData) {
        container.innerHTML = ''; // Clear previous
        // Tailwind for attendance grid
        const attendanceContainer = document.createElement('div');
        attendanceContainer.className = 'grid md:grid-cols-2 gap-6 items-center';

        const chartDiv = document.createElement('div');
        chartDiv.className = 'chart-container h-80 md:h-96 bg-white p-4 rounded-lg shadow-md'; // Tailwind for chart container
        const canvas = document.createElement('canvas');
        canvas.id = 'attendancePieChart';
        chartDiv.appendChild(canvas);
        attendanceContainer.appendChild(chartDiv);

        const listDiv = document.createElement('div');
        listDiv.className = 'space-y-3 md:space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100 bg-white p-4 rounded-lg shadow-md';
        attendanceData.forEach(item => {
            const itemDiv = document.createElement('div');
            // Tailwind for list item
            itemDiv.className = 'flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0';
            const subjectSpan = document.createElement('span');
            subjectSpan.className = 'font-medium text-sm text-gray-700';
            subjectSpan.textContent = item.subject;
            const percentageSpan = document.createElement('span');
            percentageSpan.className = 'font-semibold text-sm';
            percentageSpan.textContent = `${item.percentage}%`;
            if (item.percentage >= 75) percentageSpan.classList.add('text-green-600');
            else if (item.percentage >= 60) percentageSpan.classList.add('text-yellow-600');
            else percentageSpan.classList.add('text-red-600');

            itemDiv.appendChild(subjectSpan);
            itemDiv.appendChild(percentageSpan);
            listDiv.appendChild(itemDiv);
        });
        attendanceContainer.appendChild(listDiv);
        container.appendChild(attendanceContainer);

        // Initialize Chart.js Pie Chart
        if (attendanceChartInstance) {
            attendanceChartInstance.destroy(); // Destroy previous instance if exists
        }
        const ctx = canvas.getContext('2d');
        attendanceChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: attendanceData.map(d => d.subject),
                datasets: [{
                    label: 'Attendance Percentage',
                    data: attendanceData.map(d => d.percentage),
                    backgroundColor: [ // Example colors, can be dynamic or more varied
                        'rgba(79, 70, 229, 0.7)',  // indigo-600
                        'rgba(5, 150, 105, 0.7)',  // green-600
                        'rgba(255, 159, 64, 0.7)', // orange-400
                        'rgba(255, 99, 132, 0.7)', // red-400
                        'rgba(54, 162, 235, 0.7)', // blue-500
                        'rgba(153, 102, 255, 0.7)',// purple-500
                        'rgba(201, 203, 207, 0.7)' // gray-400
                    ],
                    borderColor: [
                         'rgba(79, 70, 229, 1)', 'rgba(5, 150, 105, 1)', 'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)',
                        'rgba(201, 203, 207, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 10 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Helper Functions (adapted from React) ---
    function extractSubjectsFromTimetable(timetable) { /* same as before */
        const subjects = new Set();
        timetable.forEach(({ slots }) => {
            slots.forEach(slot => {
                if (slot && slot.trim() !== '') {
                    const match = slot.match(/[A-Z\-]+/g);
                    if (match && match.length > 0) {
                        subjects.add(match[0]);
                    }
                }
            });
        });
        return Array.from(subjects);
    }
    function generateQuizData(subjects) { /* same as before */
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

    // --- Start the app ---
    init();
});
