# SolveNOW

> **Master University Mathematics with AI-powered active recall.**

SolveNOW is a full‑stack web application that transforms static mathematics PDFs (textbooks, lecture notes, past papers) into **interactive, university‑level quizzes with step‑by‑step solutions**. Built for **BSc Mathematics students and undergraduates**, SolveNOW combats passive reading by enforcing active recall, exam simulation, and deep performance analytics.

---

## Key Value Proposition

* Turn PDFs into **intelligent assessments**
* Practice with **exam‑grade MCQs** and rigorous distractors
* Learn *why* an answer is correct with **step‑by‑step proofs**
* Track growth over time with **advanced analytics**

---

##  Core Features

###  Authentication & Profiles

* Secure Sign Up / Sign In (JWT + bcrypt)
* Persistent user profiles
* All quizzes, attempts, and analytics are stored per user

###  Intelligent Document Processing

* Upload **multiple PDFs at once**
* Backend parses text/images and feeds structured context to Gemini

###  AI‑Powered Quiz Generation

* University‑level (BSc) math questions
* Custom quiz lengths: **30 / 60 / 100 / 120** questions
* Topics include Calculus, Linear Algebra, Proof‑based problems
* MCQs with **plausible, high‑quality distractors**

###  Focused Solve Interface

* One question per view (reduced cognitive load)
* Interactive navigator sidebar with color‑coded states:

  * ⬜ Unanswered
  * 🟩 Answered
  * 🟦 Current
  * 🟨 Flagged
* Full LaTeX rendering for all math notation

###  Dual Learning Modes

#### Exam Mode (Simulation)

* Strict time limits
* No feedback until submission
* Auto‑submit on timeout
* Designed to simulate real finals pressure

| Questions | Time    |
| --------- | ------- |
| 30        | 30 mins |
| 60        | 60 mins |
| 100 / 120 | 80 mins |

#### Study Mode (Practice)

* Instant feedback
* "Check Answer" and "Show Solution"
* No time limit

###  Review & Scoring

* Instant automated grading
* Step‑by‑step explanations for incorrect answers
* Filter by incorrect or flagged questions

###  Advanced Analytics Dashboard

* Overall accuracy rate
* Quiz history (mode, score, date)
* Topic‑wise strength analysis (charts)
* Time‑per‑question metrics
* Speed vs accuracy visualization
* Score improvement trends (30‑day window)

###  Export Tools

* Download quizzes as **PDFs**
* Includes questions, answer key, and optional solutions appendix

---

##  Tech Stack

### Frontend

* **React (Vite)**
* Styled Components
* React Router
* Framer Motion
* Lucide React / React Icons
* KaTeX or MathJax (Math Rendering)
* Recharts or Chart.js (Analytics)

### Backend

* **Node.js + Express**
* SQLite (Development)
* PostgreSQL (Production – Neon)
* JWT Authentication
* bcrypt (Password Hashing)
* Google Gemini API (PDF + multimodal analysis)

---

##  Project Structure (Immutable)

```
SolveNOW/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── .gitignore
    └── Readme.md
```

>  This structure is **strictly enforced** to maintain architectural consistency.

---

##  Application Data Flow

1. **Authentication**

   * User logs in → Server validates → JWT issued

2. **PDF Upload**

   * Client uploads PDFs → Express parses & caches content

3. **Quiz Generation**

   * Express sends context → Gemini API returns structured questions

4. **Persistence**

   * Quiz sessions & metadata stored in PostgreSQL

5. **Submission & Analytics**

   * Answers submitted → Auto‑grading → Analytics updated

---

##  UI / UX Overview

### Landing Page

* High‑impact hero section
* Animated math visuals
* Clear value proposition

### Dashboard (Authenticated)

* Personalized welcome message
* Quick stats overview
* Action cards for common tasks

### Quiz View

* Collapsible sidebar (mobile‑friendly)
* Centered question card
* Floating timer (Exam Mode)
* Sticky navigation controls

---

##  Future Enhancements (Post‑MVP)

* Handwritten solution grading (image upload)
* Auto‑generated formula cheat sheets
* Spaced repetition for weak topics

---

##  Project Status

**Version:** 1.2
**Status:** Draft / Active Development

---

##  Contributing

This project is currently under active development. Contribution guidelines will be added once the MVP stabilizes.

---

##  License

License details will be added before public release.

---

> **SolveNOW** — Learn actively. Practice intentionally. Perform confidently.
