# AuraConnect: Inclusive Voice-First Digital Gateway

> **Hackathon Winning Submission** for Inclusive Technology (Accessibility, Education, Healthcare, Employment & Digital Access for Underserved Communities).

## 🚀 Project Overview
**AuraConnect** is a production-ready, voice-first digital gateway designed to bridge the accessibility and information gap for rural, low-literacy, and underserved communities. By replacing complex interfaces with high-contrast UI, local speech recognition, and automated text-to-speech feedback, AuraConnect provides instant, barrier-free access to critical public services across **Education**, **Healthcare**, and **Employment**.

---

## 🛠️ Project Structure
```text
auraconnect_project/
│
├── backend/
│   ├── app.py                  # Main Flask application & API routes
│   └── database/
│       ├── db.py               # SQLAlchemy models & DB configuration
│       └── auraconnect.db      # SQLite database (auto-generated)
│
├── frontend/
│   ├── templates/
│   │   └── index.html          # Accessible responsive user interface
│   └── static/
│       ├── css/
│       │   └── style.css       # High-contrast styling & theme management
│       └── js/
│           └── main.js         # Speech synthesis, speech recognition & API logic
│
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation & setup instructions
