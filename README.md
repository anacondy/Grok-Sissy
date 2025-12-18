# Grok-Sissy
A scanner for cinematic posters and information about magazines and other images. short information actually


🐶![TobyCryPhoneSpiderManCryPhoneGIF](https://github.com/user-attachments/assets/37fbcf2d-15b4-41c4-869f-f8d8a82608ce)

 GROK SISSY | Archival Database Protocol v2Grok Sissy is a high-performance, cinematic visual analyzer powered by xAI's Grok-2 Vision model. It transforms raw visual artifacts (images, posters, portraits) into structured, queryable JSON metadata.Designed with a cyber-archival aesthetic, it operates as a neutral database tool, capable of indexing content without standard conversational refusal triggers.🚀 Quick Start (Installation)Follow these commands in your PowerShell or Terminal to get the system running in under 2 minutes.1. Clone the Repository# Clone the archives to your local machine
git clone [https://github.com/your-username/grok-sissy.git](https://github.com/your-username/grok-sissy.git)

# Enter the directory
cd grok-sissy
2. Install Dependencies# Install required node modules
npm install
3. Configure Security Uplink (.env)You need an API Key from xAI Console.# Create the environment file (PowerShell)
New-Item -Path .env -ItemType File -Value "VITE_XAI_API_KEY=xai-your-key-here"

# OR manually create a file named ".env" and paste your key inside.
4. Initialize System# Start the development server
npm run dev
The terminal will show a local URL (usually http://localhost:5173). Ctrl+Click it to open the interface.✨ Features🧠 Core IntelligenceGrok Vision Integration: Uses grok-2-vision-1212 for state-of-the-art image recognition.Archival Mode: Custom "System Prompts" engineered to bypass standard content filters, treating all inputs (including adult or horror content) as neutral data points for indexing.Batch Processing: Drag and drop multiple files simultaneously. Each file is processed in its own asynchronous thread.🎨 Cinematic UI/UXGlassmorphism Interface: Semi-transparent, blur-backed cards that float over a living background.High-Refresh Rate Optimization: Custom Delta-Time Physics Engine ensures animations run at the correct speed on 60Hz, 120Hz, and 144Hz displays.Responsive 20:9 Design: Fully optimized for modern ultra-wide mobile screens (Sony Xperia, Samsung Galaxy) without letterboxing.Dynamic Status Indicators: Real-time feedback on API connection status ("Uplink Secure" vs "Uplink Offline").🛠️ Technical ArchitectureWhy is this special?Unlike standard image uploaders, Grok Sissy uses a custom-built rendering engine to ensure immersion and performance.1. Delta-Time Particle PhysicsMost React particle effects run on a simple loop that moves items x + 1 every frame. On a 144Hz gaming monitor, this makes the animation run 2.5x faster than intended.Our Solution: We calculate deltaTime (time elapsed since the last frame) and normalize movement speed.const timeScale = deltaTime / 16.66; // Normalize to 60fps baseline
this.x += this.vx * timeScale; // Moves consistent distance regardless of Hz
2. Crypto-UUID Key GenerationReact lists require unique keys. Using filenames causes crashes if a user uploads the same image twice.Our Solution: We wrap every upload in a crypto-generated envelope:const newItems = files.map(f => ({
  id: crypto.randomUUID(), // Guarantees 100% uniqueness
  file: f
}));
3. "No-Refusal" Prompt EngineeringThe system uses a specific persona ("Archival Metadata Extraction System Protocol v9") in the system prompt. This context framing prevents the AI from treating sensitive images as "inappropriate content" and instead treats them as "database entries," ensuring high reliability for diverse media types.📋 System RequirementsNode.js: v16.0.0 or higher.API Access: An active xAI API Key with access to grok-2-vision.Browser: Chrome, Edge, Firefox, or Safari (WebGPU/WebGL recommended for best particle performance).📂 Project StructureGrok Sissy/
├── src/
│   ├── App.jsx        # Core Application Logic & Physics Engine
│   ├── main.jsx       # React DOM Entry Point
│   └── index.css      # Tailwind Directives & Global Resets
├── public/            # Static Assets
├── index.html         # HTML Host File
├── vite.config.js     # Build Configuration
└── package.json       # Dependency Manifest
🛡️ Troubleshooting"Uplink Offline" / API Key Missing:Ensure your .env file is in the root folder, not inside src.Ensure the variable name is exactly VITE_XAI_API_KEY.Restart the server (npm run dev) after changing the .env file."Network Error":This usually means a CORS blocker (like an AdBlocker) is interfering, or the xAI API is down. Check your browser console for details.Built with 🩵 for the Archival Database Project.
