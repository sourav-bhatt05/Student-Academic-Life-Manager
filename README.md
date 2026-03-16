# 🎓 StudentHub — Academic Life Manager

> A beautifully designed, fully interactive academic dashboard for students — built with pure HTML, CSS, and JavaScript. No frameworks, no build tools, just open and go.

---

## ✨ Features

### 🔐 Login System
- Demo credentials: **Username:** `student` · **Password:** `password123`
- Session persists until you click Sign Out

### 📊 Dashboard
- **Live stat cards** — CGPA, SGPA, Assignments Done, Average Attendance (calculated dynamically)
- **Today's Classes** — auto-pulled from your timetable for the current day of the week

### 📅 Timetable
- Full weekly schedule rendered from data
- Color-coded slots: Lecture, Practical, Tutorial, MATLAB, Lunch
- **Today's row highlighted** with a gold indicator 📍

### 📋 Assignments
- Add, mark done ✅, and delete assignments
- Sorted: pending on top, completed below
- **Persisted in `localStorage`** — survives page refresh

### ⭐ Quizzes
- 5 subjects: **DBMS, OOPS, Maths (MA), Python (PY), Humanities (HS)**
- 4 questions per subject with multiple-choice options
- Correct/incorrect answer revealed after each pick (green/red)
- Progress bar, live score, and result screen with emoji rating

### 📈 Attendance
- Doughnut chart (via Chart.js) + subject-wise progress bars
- **Click any subject row** to update its attendance % — chart and bar update live
- Color coding: 🟢 ≥75% · 🟡 60–74% · 🔴 <60%
- Changes saved to `localStorage`

### 📆 Events
- Academic calendar with key dates (Mid-Sem, End-Sem, Viva, Results etc.)

### 📝 Notes
- Multiple named notebooks (General, Maths, DBMS — and add your own)
- Full textarea editor per notebook
- **Auto-saves** to `localStorage` with a "✓ Saved" badge
- Add and delete notebooks

### 🎓 GPA Calculator
- Pre-filled subject table with credits and grade selectors (O, A+, A, B+, B, C, D, F)
- **SGPA calculated live** as you change grades
- Add more subject rows dynamically

### 🍅 Pomodoro Timer
- SVG ring countdown with gradient stroke
- Modes: **Focus (25 min)** · **Short Break (5 min)** · **Long Break (15 min)**
- Start / Pause / Reset
- Session dot tracker (4 sessions per cycle)
- Toast notification when a session ends

---

## 🌙 Dark Mode
Click the **moon icon** 🌙 in the navbar to toggle dark/light mode — preference saved to `localStorage`.

## 🕐 Live Clock
The navbar shows a live updating clock with date and AM/PM time.

## 🍞 Toast Notifications
Non-intrusive slide-in toasts for all user actions (add, delete, update, quiz feedback etc.)

---

## 🚀 Getting Started

No installation needed. Just open the file in your browser:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/Student-Academic-Life-Manager.git

# Open in browser
open index.html
```

Or simply **double-click** `index.html` — it runs entirely in the browser.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | Vanilla CSS (CSS Variables, Flexbox, Grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | [Chart.js](https://www.chartjs.org/) |
| Fonts | [Outfit](https://fonts.google.com/specimen/Outfit) + DM Sans (Google Fonts) |
| Storage | Browser `localStorage` |

---

## 📁 Project Structure

```
Student-Academic-Life-Manager/
├── index.html      # App shell, login page, navbar, tabs container
├── style.css       # All styles including dark mode, animations, tab layouts
├── script.js       # All logic: tabs, quiz, assignments, GPA calc, timer
└── README.md
```

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Username | `student` |
| Password | `password123` |

---

## 📸 Preview

> Dashboard in Dark Mode — with live stat cards, today's schedule, and 9 fully functional tabs.

---

*Built by Sourav Bhatt · B.Tech CSE · 3rd Year*
