# Smart Soft Computers — 2026 Cyber Hardware Experience Store

A showcase catalog website designed for **Smart Soft Computers** featuring real-time interactive 3D WebGL animations, cyber lighting, dynamic telemetry, and direct conversion hooks (Phone + WhatsApp + Store Walk-In).

---

## ⚡ What Makes This Look Like 2026

1. **Interactive 3D WebGL Laptop (Three.js)**:
   - Real-time procedural 3D laptop in the hero section that users can **drag and rotate in 3D space** (with touch gyro on mobile).
   - The laptop display runs an animated live OS telemetry canvas with real-time benchmark sine waves and store diagnostic badges.
   - 3D floating cyber particles and holographic HUD markers in 3D depth.
2. **True 3D Gyro Card Tilt**:
   - Every laptop card calculates mouse/touch position and tilts dynamically in 3D (`perspective(1000px) rotateX(...) rotateY(...) scale3d(...)`) with specular highlight reflection.
3. **Conic Neon Laser Border Beams**:
   - High-tech laser trace animation (`conic-gradient`) running smoothly around cards on hover.
4. **Vibrant Cyber Tech Color Palette**:
   - Deep space obsidian `#050607` with glowing electric lime (`#C6F135`), cyber cyan (`#38bdf8`), and emerald laser orbs.
   - No dull flat monochrome — rich glowing volumetric depth and subtle background matrix gridlines.
5. **High-Resolution Studio Hardware Imagery**:
   - Crisp, realistic studio angle photos for MacBook Pro, ThinkPad, Dell XPS OLED, HP Victus, ASUS ZenBook, and Acer Swift.
   - Benchmark score indicators (e.g. 96/100) and battery health capacity tags.
6. **Direct WhatsApp Conversion Hooks**:
   - **"Ask for Video on WhatsApp"**: Allows Instagram visitors to request a 60-second video of the exact laptop before traveling to the store.
   - Pre-filled WhatsApp enquiry messages specifying the exact model and price.
7. **Store Walk-In Experience HUD**:
   - Live **"● STORE OPEN NOW"** radar beacon.
   - Clear address, visiting hours, and one-tap Google Maps directions.

---

## 📁 Project Structure

```
smart-soft-computers/
│
├── index.html                 # Main website entry point (modular 2026 cyber edition)
├── css/
│   └── styles.css             # 2026 Cyber styling, floating island glass, laser borders
├── js/
│   ├── config.js              # Shop name, phone, WhatsApp number, store address & hours
│   ├── data.js                # Laptop catalog with specs, images, benchmarks & prices
│   └── app.js                 # Three.js 3D engine, 3D card tilt, instant filter engine, popup
├── single-file/
│   └── index.html             # 100% self-contained standalone file (everything inline)
└── README.md
```

---

## 🛠️ How to Customize Your Store Details

Open [`js/config.js`](file:///C:/Users/Dell/.gemini/antigravity/scratch/smart-soft-computers/js/config.js) in any text editor:

```javascript
const SHOP_CONFIG = {
  shopName: "Smart Soft Computers",
  tagline: "Quality new & used laptops with warranty.",
  phoneDisplay: "+91 98765 43210",       // Displayed phone number
  phoneRaw: "+919876543210",             // For direct tel: calls
  whatsappDisplay: "+91 98765 43210",
  whatsappNumber: "919876543210",         // WhatsApp number without + or spaces
  address: "Shop #12, Computer Market, Near Metro Station, Main Road",
  mapUrl: "https://maps.google.com/?q=Smart+Soft+Computers",
  openingHours: "Mon - Sat: 10:30 AM – 9:00 PM | Sun: 11:30 AM – 7:00 PM",
  instagramLink: "https://instagram.com/your_handle"
};
```

---

## 💻 How to Add / Edit Laptops

Open [`js/data.js`](file:///C:/Users/Dell/.gemini/antigravity/scratch/smart-soft-computers/js/data.js). You can edit any existing laptop or add a new object to the array:

```javascript
{
  id: "macbook-pro-14-m2",
  name: "Apple MacBook Pro 14\" M2 Pro",
  brand: "Apple",
  category: "Pro Creator / Dev",
  condition: "Refurbished",
  conditionGrade: "Grade A+ • Pristine Mint",
  conditionBadge: "💎 Certified Mint",
  status: "Available",
  price: 134999,
  originalPrice: 199900,
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85",
  cpu: "Apple M2 Pro (10-Core CPU / 16-Core GPU)",
  ram: "16 GB Unified High-Speed Memory",
  ramSizeGb: 16,
  storage: "512 GB NVMe Solid State Drive",
  screen: "14.2\" Liquid Retina XDR Mini-LED (120Hz ProMotion)",
  gpu: "Apple 16-Core Integrated Neural Graphics",
  batteryHealth: "96%",
  batteryBackup: "Up to 16 Hours Real-World Use",
  os: "macOS Sonoma (Factory Clean Reset)",
  warranty: "6 Months Direct Store Warranty",
  boxContents: "Original 67W MagSafe 3 Charger & Box",
  benchmarkScore: 96,
  urgentTag: "Only 1 unit available at this price"
}
```

---

## 🚀 How to View Locally
Double-click [`index.html`](file:///C:/Users/Dell/.gemini/antigravity/scratch/smart-soft-computers/index.html) to open the site directly in your browser!
