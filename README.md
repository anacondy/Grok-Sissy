# 🐶 Grok Sissy | Archival Database Protocol v2

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://anacondy.github.io/Grok-Sissy)

A **high-performance, cinematic visual analyzer** powered by **xAI's Grok-2 Vision model**. Grok Sissy transforms raw visual artifacts (images, posters, portraits) into **structured, queryable JSON metadata**. 

Designed with a **cyber-archival aesthetic**, it operates as a **neutral database tool**, capable of indexing content without standard conversational refusal triggers.

---

## 🚀 Quick Start (Installation)

### 1. Clone the Repository
```bash
git clone https://github.com/anacondy/Grok-Sissy.git
cd Grok-Sissy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Security Uplink (.env)
Create a `.env` file in the **root directory** and add your **xAI API Key**:
```ini
VITE_XAI_API_KEY=xai-your-key-here
```

### 4. Initialize System
```bash
npm run dev
```
The terminal will display a local URL (e.g., `http://localhost:5173`). Open it in your browser.

---

## ✨ Features

### 🧠 Core Intelligence
- **Grok Vision Integration**: Uses `grok-2-vision-1212` for state-of-the-art image recognition.
- **Archival Mode**: Custom "System Prompts" bypass standard content filters, treating all inputs as neutral data points.
- **Batch Processing**: Drag and drop multiple files for asynchronous processing.

### 🎨 Cinematic UI/UX
- **Glassmorphism Interface**: Semi-transparent, blur-backed cards.
- **High-Refresh Rate Optimization**: Delta-Time Physics Engine for smooth animations on 60Hz, 120Hz, and 144Hz displays.
- **Responsive 20:9 Design**: Optimized for ultra-wide mobile screens (Sony Xperia, Samsung Galaxy).
- **Dynamic Status Indicators**: Real-time API connection feedback.

### 🛠️ Technical Architecture
- **Delta-Time Particle Physics**: Normalizes animation speed across refresh rates.
- **Crypto-UUID Key Generation**: Ensures unique keys for React lists.
- **"No-Refusal" Prompt Engineering**: Treats sensitive images as neutral database entries.

---

## 📋 System Requirements
- **Node.js**: v16.0.0 or higher.
- **API Access**: Active xAI API Key with `grok-2-vision` access.
- **Browser**: Chrome, Edge, Firefox, or Safari (WebGPU/WebGL recommended).

---

## 📂 Project Structure
```
Grok Sissy/
├── src/
│   ├── App.jsx        # Core Logic & Physics Engine
│   ├── main.jsx       # React DOM Entry Point
│   └── index.css      # Tailwind Directives
├── public/            # Static Assets
├── index.html         # HTML Host File
├── vite.config.js     # Build Configuration
└── package.json       # Dependency Manifest
```

---

## 🛡️ Troubleshooting
- **"Uplink Offline" / API Key Missing**:
  - Ensure `.env` is in the **root folder**. 
  - Verify the variable name: `VITE_XAI_API_KEY`.
  - Restart the server after updating `.env`.

- **"Network Error"**:
  - Check for CORS blockers (e.g., AdBlocker).
  - Verify xAI API status.

---

## 📦 Releases
Download pre-built binaries for your platform:
- [Windows](https://github.com/anacondy/Grok-Sissy/releases)
- [macOS](https://github.com/anacondy/Grok-Sissy/releases)
- [Linux](https://github.com/anacondy/Grok-Sissy/releases)
- [Android](https://github.com/anacondy/Grok-Sissy/releases)
- [iOS](https://github.com/anacondy/Grok-Sissy/releases)

---

## 📝 Feedback
Found a bug? Have a suggestion? Open an issue [here](https://github.com/anacondy/Grok-Sissy/issues)!

---
Built with 🩵 for the **Archival Database Project**.
