# SK Webberiz - Supermal Karawaci

A React + TypeScript website for Supermal Karawaci featuring a complete Independence Day treasure hunt game with anti-fraud detection.

## 🎯 Features

### Marketing Website
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Framer Motion animations and Radix UI components
- **Events & Promotions**: Dynamic content management
- **Store Directory**: Featured tenants and facilities
- **Contact Information**: Complete visitor information

### 🏆 Treasure Hunt Game
- **Purchase Validation**: Minimum Rp 150,000 purchase requirement
- **QR Code Scanning**: HTML5 QR scanner with manual input fallback
- **Photo Capture**: Camera access with selfie validation
- **Quiz System**: Timed questions with scoring
- **Progress Tracking**: Player statistics and achievements

### 🛡️ Anti-Fraud Detection
- **Face Detection**: Validates actual faces in selfies using face-api.js
- **EXIF Metadata**: Checks photo timestamps and authenticity
- **Geolocation**: Device location verification
- **Metadata Tracking**: Comprehensive submission logging
- **Duplicate Prevention**: Prevents multiple location submissions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Face detection model files (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/elangalfarez/sk-webbers.git
   cd sk-webbers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Database Setup**
   - Follow instructions in `DATABASE_SCHEMA.md`
   - Set up Supabase tables and storage

5. **Face Detection Models (Optional)**
   - Download models from [face-api.js repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - Place model files in `public/models/`
   - See `public/models/README.md` for details

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: Radix UI primitives, Framer Motion
- **Backend**: Supabase (Database, Storage, Auth)
- **Computer Vision**: face-api.js for face detection
- **QR Scanner**: html5-qrcode
- **Image Processing**: piexifjs for EXIF data

## 📱 Treasure Hunt User Flow

1. **Purchase Validation** → Enter purchase amount (min Rp 150k)
2. **Registration** → Receive unique 6-character code
3. **QR Scanning** → Scan location QR codes
4. **Photo Capture** → Take selfie with decorations + fraud validation
5. **Quiz** → Answer timed questions for points
6. **Completion** → Score tracking and next location

## 🎨 Design System

Custom Tailwind configuration with SK Webberiz branding:
- **Primary**: `#5A2E8A` (Royal Purple)
- **Secondary**: `#D4AF37` (Gold)
- **Background**: `#121421` (Chinese Black)
- **Accent**: `#4A256F` (Dark Purple)

## 📁 Project Structure

```
src/
├── components/
│   ├── treasureHunt/          # Treasure hunt game components
│   │   ├── PlayerRegistration.tsx
│   │   ├── QRScanner.tsx
│   │   ├── PhotoCapture.tsx
│   │   └── Quiz.tsx
│   ├── ui/                    # Reusable UI components
│   └── [other sections]       # Marketing website components
├── lib/
│   ├── supabase.ts           # Database configuration
│   ├── treasureHuntUtils.ts  # Game utilities & fraud detection
│   └── utils.ts              # General utilities
└── ...
```

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🛡️ Security Features

- **Input Validation**: All user inputs validated
- **Photo Verification**: Multiple fraud detection layers
- **Rate Limiting**: Prevents abuse (implement server-side)
- **Data Privacy**: Minimal data collection
- **Secure Storage**: Private Supabase storage bucket

## 📖 Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Complete database setup guide
- [Face Detection Setup](./public/models/README.md) - Model installation
- [Development Guide](./CLAUDE.md) - Architecture overview

## 🎮 Game Mechanics

### Scoring System
- **Base Points**: 100-200 points per location
- **Speed Bonus**: Up to 20 extra points for quick answers
- **Total Tracking**: Cumulative score across locations

### Anti-Fraud Measures
- Face detection ensures actual selfies
- EXIF timestamp validation prevents screenshots
- Geolocation verification confirms physical presence
- Device fingerprinting for security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to Supermal Karawaci.

## 🏪 About Supermal Karawaci

Located in Tangerang, Supermal Karawaci is a premier shopping and lifestyle destination featuring hundreds of stores, restaurants, and entertainment facilities. The treasure hunt celebrates Indonesian Independence Day with interactive experiences throughout the mall.
