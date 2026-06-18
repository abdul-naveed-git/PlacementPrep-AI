# PlacementPilot AI
![PlacementPilot AI](https://img.shields.io/badge/PlacementPilot-AI%20Powered%20Placement%20Prep-7C3AED?style=for-the-badge)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![API](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Authentication](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![UI](https://img.shields.io/badge/UI-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Build](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Deployment](https://img.shields.io/badge/Backend-EC2-orange?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/ec2/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## Overview

PlacementPilot AI is an AI-powered placement preparation platform designed to help students prepare effectively for campus recruitment processes. The platform addresses common challenges faced by students, including the lack of personalized preparation paths, scattered interview experiences, information overload, and difficulty assessing readiness for target companies.

By combining LeetCode profile analysis, company interview experiences, AI-generated insights, and personalized DSA roadmaps, PlacementPilot AI provides a structured and data-driven approach to placement preparation.

---

## Problem Statement

Students preparing for campus placements face several challenges:

* No personalized preparation path.
* Interview experiences are scattered across multiple sources such as WhatsApp, Telegram, PDFs, and senior notes.
* Information overload from hundreds of interview experiences.
* No effective way to compare current skills against company expectations.

---

## Solution

PlacementPilot AI provides a centralized platform that combines:

* LeetCode Profile Analysis
* Company Interview Experiences
* SkillGap Analyzer
* Personalized DSA Roadmaps

The platform helps students identify weaknesses, prepare strategically, track progress, and improve placement readiness through AI-driven recommendations.

---

## User Flow

1. Register or Login
2. Connect LeetCode Profile
3. Select Target Companies
4. Receive a Personalized Preparation Roadmap
5. Track Progress and Placement Readiness

---

## Core Modules

### 1. DSA Roadmap

* Topic-wise roadmaps
* Personalized DSA sheet generation
* Progress tracking
* Recommended problems based on identified weaknesses

### 2. Company Preparation

* Company-specific preparation pages
* Frequently asked topics
* Preparation checklists
* Most asked interview questions

### 3. Interview Experience Hub

* Structured interview experience submissions
* Filtering by company, role, and difficulty
* Upvote and helpfulness system

### 4. AI Experience Summarizer

* Company-wise interview experience summaries

### 5. Skill Gap Analyzer

* Comparison of student skills with company expectations
* Identification of weak topics
* Suggested improvement priorities

### 6. Placement Readiness Engine

* Readiness percentage calculation
* Weakness analysis
* Actionable preparation recommendations

### 7. Progress Center

* Topic completion tracking
* Roadmap progress tracking
* Company readiness progress monitoring

---

## Landing Page

The landing page includes:

* Hero Section
* How It Works
* Feature Highlights
* Company Insights Preview

---

## Home Page

The home page provides category-based navigation for:

* DSA Roadmap
* Company Preparation
* Interview Experiences
* SkillGap Analyzer
* BookMarks
* Progress Center

---

## Key AI Features

* Personalized DSA Sheet Generator
* Company Experience Summarizer
* Skill Gap Analyzer
* Placement Readiness Engine

---

## Project Structure

```bash
PlacementPilot-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validation/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd PlacementPilot-AI
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Future Scope

* Enhanced company insights and analytics
* Expanded interview experience database
* Advanced readiness assessment models
* Improved AI-driven preparation recommendations

---

## Conclusion

PlacementPilot AI goes beyond traditional placement preparation platforms by actively guiding students throughout their preparation journey. Through AI-powered analysis, personalized roadmaps, interview experience summarization, skill gap detection, and readiness evaluation, the platform enables students to prepare in a focused and structured manner for their target companies.
