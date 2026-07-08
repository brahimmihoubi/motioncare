# MotionCare - Pediatric Rehabilitation Exercise Assistant

![Expo](https://img.shields.io/badge/Expo-1C2024?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

MotionCare is a modern mobile application designed to assist doctors, physical therapists, and medical professionals in managing, tracking, and prescribing pediatric rehabilitation exercises for their young patients. 

## Key Features

- **Doctor Dashboard:** Get an overview of all active patients, critical deviations, and general progress at a glance.
- **Patient Management:** Maintain detailed profiles for each pediatric patient, including their specific conditions, assigned programs, and progress tracking.
- **Exercise Programs:** Prescribe and edit custom rehabilitation programs with specific exercise routines tailored for pediatric care.
- **Progress Tracking:** Monitor real-time recovery metrics and program adherence through comprehensive charts and statistics.
- **Deviation Alerts:** Automatically track and receive alerts for critical deviations from prescribed physical movements.
- **Modern UI/UX:** Clean, intuitive, and accessible interface built with a beautiful teal color palette, designed for busy medical professionals.

## Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** Custom robust StyleSheet architecture (`theme/styles.ts`)
- **Typography:** [Google Fonts (Poppins)](https://fonts.google.com/specimen/Poppins)
- **Icons:** [Lucide React Native](https://lucide.dev/)

## Project Structure

```text
motioncare/
├── assets/                 # Images, logos, and static assets
├── src/
│   ├── components/         # Reusable UI components (BottomNav, Avatar, etc.)
│   ├── data/               # Mock data for patients, programs, and deviations
│   ├── screens/            # Core screens (Dashboard, Patients, Programs, SignUp, etc.)
│   ├── theme/              # Centralized styling, layout logic, and color palette
│   └── types/              # TypeScript type definitions and interfaces
├── App.tsx                 # Main application entry point & simple state routing
└── package.json            # Project dependencies and scripts
```

## Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Expo CLI
- Expo Go app on your physical device OR an iOS Simulator / Android Emulator

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/motioncare.git
   cd motioncare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

### Running the App

Once the development server is running, you can open the app in the following ways:

- **Physical Device:** Open the Expo Go app on your phone and scan the QR code generated in the terminal.
- **iOS Simulator:** Press `i` in the terminal (Requires macOS and Xcode).
- **Android Emulator:** Press `a` in the terminal (Requires Android Studio).
- **Web Browser:** Press `w` in the terminal.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute to the MotionCare ecosystem.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
