# MotionCare - Pediatric Rehabilitation Mobile Application

![Expo](https://img.shields.io/badge/Expo-1C2024?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

MotionCare is a professional-grade mobile application built for doctors, physical therapists, and medical professionals to manage, monitor, and prescribe pediatric rehabilitation exercise programs. With a polished UI, smooth animations, full dark/light theme support, and persistent user preferences, it delivers a premium clinical experience on iOS and Android.

---

## Features

### Doctor Dashboard
- At-a-glance view of active patients, schedule, satisfaction metrics, and critical alerts.
- Quick navigation to patients, programs, progress tracking, and notifications.

### Patient Management
- Browse all patients in a searchable, filterable list with Active/Inactive status tabs.
- Drill into individual patient profiles showing conditions, program adherence, circular progress indicators, and deviation summaries.

### Exercise Programs
- View and manage rehabilitation programs categorized by type (strength, mobility, cardio).
- Edit programs with assigned exercises, sets, reps, duration, and difficulty level.
- Detailed exercise view with visual frames, descriptions, and routine counters.

### Progress Tracking
- Interactive SVG area and bar charts visualizing patient recovery metrics over time.
- Per-patient selector for comparing individual performance data.
- Weekly goal progress bars and small stat tiles for rapid insights.

### Deviation Alerts
- Deviation log with patient mini-cards, calendar-based filters, and severity grid.
- Color-coded severity levels (critical, moderate, mild) for instant triage.

### Notifications
- Categorized notification feed with unread/read sections.
- Mark all as read action, per-notification dismiss, and dynamic unread badge count.

### Dark and Light Theme
- Full application-wide dark mode and light mode support.
- Toggle via **Settings > Preferences > Dark Mode**.
- Theme preference is automatically saved and restored on next launch using AsyncStorage.
- Every screen, component, and local style adapts dynamically to the selected theme.

### Onboarding and Authentication
- Animated splash screen with pulsing logo and loading dots.
- Multi-slide onboarding walkthrough with progress indicators.
- Welcome screen with sign-in navigation.
- Sign-up screen with form validation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 54) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.9 |
| Theming | Custom `ThemeContext` + `AsyncStorage` for persistence |
| Styling | Dynamic `StyleSheet` factory pattern (`getGlobalStyles`, `getLocalStyles`) |
| Typography | [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins) (9 weights) |
| Icons | [Lucide React Native](https://lucide.dev/) |
| Charts | [React Native SVG](https://github.com/software-mansion/react-native-svg) |
| Storage | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) |

---

## Project Structure

```text
motioncare/
├── assets/                     # App icons, splash images, and static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   └── index.tsx           # BottomNav, Avatar, MotionCareLogo
│   ├── data/
│   │   └── mockData.ts         # Sample patients, programs, deviations, and chart data
│   ├── screens/                # All application screens (15 screens)
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── PatientsScreen.tsx
│   │   ├── PatientDetailScreen.tsx
│   │   ├── ProgramsScreen.tsx
│   │   ├── EditProgramScreen.tsx
│   │   ├── ExerciseDetailScreen.tsx
│   │   ├── DeviationsScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── MoreScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── NotificationsScreen.tsx
│   ├── theme/                  # Design system and theming
│   │   ├── colors.ts           # lightColors and darkColors palettes
│   │   ├── styles.ts           # Global dynamic StyleSheet factory (getGlobalStyles)
│   │   └── ThemeContext.tsx    # React context provider for theme state
│   └── types/                  # TypeScript type definitions and Screen union type
├── App.tsx                     # Application root, font loading, ThemeProvider, routing
└── package.json
```

---

## Theme Architecture

The dark/light theme system is built on a fully dynamic styling architecture:

- **`colors.ts`** exports two palettes — `lightColors` and `darkColors` — each defining tokens for `background`, `card`, `text`, `textSecondary`, `textMuted`, `border`, `teal`, and semantic colors (`error`, `warning`, `success`).
- **`ThemeContext.tsx`** provides a `ThemeProvider` wrapping the entire app. It exposes `theme`, `colors`, `styles`, `toggleTheme`, and `setTheme` via the `useTheme()` hook.
- **`styles.ts`** exports `getGlobalStyles(colors)` — a function that produces a full `StyleSheet` object derived from the active color palette.
- **Each screen** calls `useTheme()` to get the current `colors` object and computes its local styles via a `getLocalStyles(colors)` factory, ensuring all colors respond to theme changes in real time.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (iOS or Android) OR a configured iOS Simulator / Android Emulator

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/brahimmihoubi/motioncare.git
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

After the server starts, open the app using one of the following methods:

| Method | How |
|---|---|
| Physical Device | Open Expo Go and scan the QR code from the terminal |
| iOS Simulator | Press `i` in the terminal (requires macOS + Xcode) |
| Android Emulator | Press `a` in the terminal (requires Android Studio) |
| Web Browser | Press `w` in the terminal |

---

## Available Scripts

```bash
npm start          # Start the Expo development server
npm run android    # Launch on Android emulator/device
npm run ios        # Launch on iOS simulator/device
npm run web        # Launch in the web browser
```

---

## Screens Overview

| Screen | Description |
|---|---|
| Splash | Animated logo reveal with pulsing ring and loading dots |
| Onboarding | 3-slide feature introduction with progress indicators |
| Welcome | App entry point with sign-in and get-started navigation |
| Sign Up | Registration form for new doctor accounts |
| Dashboard | Overview of patients, schedule, stats, and quick actions |
| Patients | Searchable patient list with Active/Inactive filters |
| Patient Detail | Full patient profile with charts, stats, and program info |
| Programs | Library of rehabilitation programs with sub-type tabs |
| Edit Program | Program builder with exercise list management |
| Exercise Detail | Detailed exercise view with visual frames and routine info |
| Deviations | Deviation log with calendar filters and severity grid |
| Progress | SVG area and bar charts for patient progress analytics |
| More | Doctor profile, stats banner, and menu navigation |
| Settings | Account, preferences, support, and danger zone settings |
| Notifications | Notification feed with unread/read sections and actions |

---

## Related Projects

- [MotionCare Dashboard](https://github.com/brahimmihoubi/motioncare_dashboard) - The companion web admin dashboard built with React + Vite.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
