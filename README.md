# MotionCare

A mobile application for physical rehabilitation management, designed for medical professionals. MotionCare enables doctors and physiotherapists to manage patients, design rehabilitation programs, monitor real-time exoskeleton sessions, and track patient progress through a unified interface.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Screens and Features](#screens-and-features)
- [Navigation](#navigation)
- [Services Layer](#services-layer)
- [Theme System](#theme-system)
- [Shared Components](#shared-components)
- [Data Types](#data-types)
- [Authentication Flow](#authentication-flow)
- [Real-Time Communication](#real-time-communication)
- [Build and Deployment](#build-and-deployment)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)

---

## Overview

MotionCare is built with React Native and Expo. It targets physiotherapy clinics and rehabilitation centers where a treating physician needs to manage a patient caseload, prescribe structured exercise programs, supervise live exoskeleton-assisted sessions, and review outcome data.

The application communicates with a dedicated REST API backend and maintains a real-time Socket.IO connection when a session is active. An offline caching layer ensures that read-only data remains accessible when network connectivity is temporarily unavailable.

**App Identifier:** `com.anonymous.motioncare`  
**Version:** 1.0.0  
**Orientation:** Portrait only  
**Platforms:** Android, iOS, Web  
**EAS Project ID:** `3f10b8b6-2fd7-4c18-93d9-846be111ace5`

---

## Technology Stack

| Category | Library | Version |
|---|---|---|
| Framework | Expo | ~54.0.36 |
| UI Runtime | React Native | 0.81.5 |
| Language | TypeScript | ~5.9.2 |
| React | React | 19.1.0 |
| HTTP Client | Axios | ^1.18.1 |
| Real-Time | Socket.IO Client | ^4.8.3 |
| Local Storage | AsyncStorage | 2.2.0 |
| Vector Graphics | react-native-svg | 15.12.1 |
| Icons | lucide-react-native | ^0.544.0 |
| Typography | Poppins (via @expo-google-fonts) | ^0.4.1 |
| Gradients | expo-linear-gradient | ~15.0.8 |
| Loading Skeletons | react-native-shimmer-placeholder | ^2.0.9 |
| Safe Area | react-native-safe-area-context | ~5.6.0 |
| Web Support | react-native-web | ^0.21.0 |
| Status Bar | expo-status-bar | ~3.0.9 |

---

## Project Structure

```
motioncare/
├── App.tsx                  # Root component: routing, auth state, font loading
├── index.ts                 # Expo entry point
├── app.json                 # Expo configuration
├── eas.json                 # Expo Application Services build profiles
├── tsconfig.json            # TypeScript compiler configuration
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (not committed)
├── assets/                  # Static assets (logo, icons)
└── src/
    ├── components/
    │   └── index.tsx        # Shared UI components (Avatar, BottomNav, MotionCareLogo, ShimmerPlaceholder)
    ├── data/
    │   └── mockData.ts      # Static mock data used by DeviationsScreen
    ├── screens/             # One file per application screen (21 screens)
    ├── services/
    │   ├── api.ts           # REST API client, interceptors, and service modules
    │   └── socket.ts        # Socket.IO client singleton
    ├── theme/
    │   ├── colors.ts        # Light and dark color palettes
    │   ├── ThemeContext.tsx  # React context for theme state and toggling
    │   └── styles.ts        # Global StyleSheet computed from active theme
    └── types/
        └── index.ts         # Shared TypeScript types (Screen, NavParams, NavigateFn)
```

---

## Architecture

### Navigation Model

MotionCare uses a custom state-based navigation system rather than a dedicated navigation library. A single `screen` state variable of type `Screen` is held in the root `AppContent` component. A `navigate(screen, params)` function is passed as a prop down to each screen, allowing any screen to trigger a transition. Navigation parameters are stored in a parallel `navParams` state object.

This approach avoids the overhead of a navigation library and keeps the routing logic entirely within `App.tsx`, which makes authentication guards straightforward to implement.

### State Management

There is no global state library. State is co-located with the component that owns it. The only application-wide shared state is:

- **Authentication state** — managed in `AppContent` and communicated to children through props.
- **Theme state** — managed in `ThemeProvider` and accessed anywhere via the `useTheme` hook.

### Offline Caching

All GET requests go through the `apiGet` wrapper in `src/services/api.ts`. After a successful response, the payload is written to AsyncStorage under the key `mc_cache_<url>`. If a subsequent request fails due to a network error (no `error.response`), the cached value is returned transparently. This provides graceful degradation without requiring the user to take any action.

---

## Screens and Features

### Authentication Screens

#### SplashScreen
Displays the MotionCare brand logo and an animated entry sequence. On completion it calls `onDone`, which triggers the initial routing decision in `App.tsx`. The splash screen waits for the application initialization (token validation, AsyncStorage reads) to complete before allowing navigation to proceed.

#### OnboardingScreen
A multi-step introduction shown only on the first launch of the application. It presents the core value proposition of the platform. The user may complete the flow or skip it. Completion is persisted to AsyncStorage (`mc_onboarding_done`), ensuring it is never shown again.

#### WelcomeScreen
A landing screen shown after onboarding completes for users who have not yet registered. Provides entry points to both the registration and login flows.

#### SignUpScreen
Registration form for new doctor accounts. Collects name, email, password, and optional specialization. On successful registration it stores the `mc_registered` flag in AsyncStorage and navigates directly to the dashboard without requiring a separate login step.

#### LoginScreen
Email and password authentication form. Uses the `AuthService.login` method, which stores the received access token and refresh token in AsyncStorage and pre-loads the Authorization header on the Axios instance.

---

### Main Application Screens

#### DashboardScreen
The home screen of the authenticated application. Displays two key metrics fetched from the API: total patient count and total session count with compliance rate. Below the metrics is a list of the four most recently active patients, each showing their name, condition, status badge, and date of last session. A shimmer loading skeleton is shown while data is being fetched. The dashboard subscribes to six Socket.IO events (`patient:created`, `patient:updated`, `patient:deleted`, `session:created`, `session:updated`, `session:deleted`) and refreshes its data automatically when any of these events is received.

#### PatientsScreen
A scrollable list of all patients assigned to the logged-in doctor. Each row displays the patient's name, condition, status, and last session date. Tapping a patient navigates to PatientDetailScreen with the patient's ID passed as a navigation parameter. A floating action button navigates to AddPatientScreen.

#### PatientDetailScreen
Shows the full profile of a single patient. The screen fetches patient data and the patient's active rehabilitation program in parallel. Key information displayed includes:

- Patient name, email, age, and clinical notes
- A summary of the active program (name and exercise count) rendered with an SVG progress ring
- The full list of exercises in the active program (name, sets, repetitions)
- A primary action button that navigates to EditProgramScreen if a program exists, or AddProgramScreen if no program has been assigned

#### ProgramsScreen
Lists all rehabilitation programs created by the logged-in doctor. Each entry shows the program name, the associated patient, the number of exercises, and its active/inactive status. A button to create a new program links to AddProgramScreen.

#### AddProgramScreen
A multi-step form for creating a new rehabilitation program. The screen fetches the full patient list and exercise library from the API on mount. The doctor enters a program name, selects a patient from a bottom-sheet modal, and adds one or more exercises from the exercise library modal. For each added exercise the doctor specifies the number of sets, repetitions, and rest duration between sets in seconds. On submission the program is created via `DataService.createProgram` and the screen navigates back to ProgramsScreen.

#### EditProgramScreen
Functionally similar to AddProgramScreen but pre-populates all fields from an existing program retrieved by ID. Allows the doctor to rename the program, toggle its active status, add exercises, remove exercises, and adjust exercise parameters. Changes are saved via `DataService.updateProgram`.

#### ExerciseDetailScreen
Displays detailed information about a single exercise including its description, instructions, and parameters. Navigated to from ProgramsScreen or EditProgramScreen.

#### LiveSessionScreen
The real-time exoskeleton control and monitoring screen. This screen is navigated to with a `sessionId` parameter. On mount it:

1. Fetches the session record and the current exoskeleton state from the API.
2. Emits `join_session` to the Socket.IO server to subscribe to telemetry events.
3. Listens for `exo:update` events to update telemetry readings in real time.
4. Listens for `session:updated` events to update session status.

The screen displays four telemetry tiles: Battery Level (%), Motor Temperature (Celsius), Joint Angle (degrees), and Velocity (m/s). Session status is reflected visually with color-coded badges.

The doctor can issue the following commands, each mapped to an API endpoint:

| Action | Status Condition | API Endpoint |
|---|---|---|
| Start | pending | POST /exoskeleton/session/:id/countdown |
| Pause | running | POST /exoskeleton/session/:id/pause |
| Resume | paused | POST /exoskeleton/session/:id/resume |
| Stop | running, paused, countdown | POST /exoskeleton/session/:id/stop |
| Emergency Stop | running, paused, countdown | POST /exoskeleton/session/:id/emergency-stop |

An emergency stop requires confirmation through a native alert dialog before the request is sent. On unmount, `leave_session` is emitted and all socket listeners are cleaned up.

#### SessionHistoryScreen
Displays a chronological list of past sessions for a patient. Each entry shows the session date, duration, status, and program name. Tapping a session navigates to LiveSessionScreen to review its details.

#### DeviationsScreen
Shows exercise deviation events logged during sessions for a specific patient. Deviations are categorized by severity: High, Medium, and Low. Each deviation entry shows the event title, a description, the severity badge, and the date it occurred. A summary grid at the top counts the number of events in each severity category. Time-range filters (This Week, Last Week, All Time) are available as horizontal pill selectors. Currently uses static mock data as a placeholder for the API integration.

#### ProgressScreen
An analytics overview screen showing global statistics across all patients. Data is fetched from the `/dashboard/progress` API endpoint. The screen renders:

- Four metric tiles: Completion Rate, Average Score, Streak, and Total Duration
- An SVG area chart showing daily exercise completion rates for the last seven days
- An SVG bar chart showing session counts per week for the last six weeks

Both charts are implemented with raw SVG paths using `react-native-svg`, without a third-party charting library. If no data is available, the charts render with zero values to prevent layout errors.

#### NotificationsScreen
Displays an in-app notification feed. Notifications are categorized into four types with distinct icons and colors: Alert (red), Info (blue), Success (green), and Reminder (orange). Unread notifications are listed in a "New" section; read notifications appear in an "Earlier" section. The doctor can mark individual notifications as read by tapping them, mark all as read using the header button, or dismiss individual notifications permanently. Currently uses static mock data; the notification feed is not yet connected to a live API endpoint.

#### ExerciseRequestScreen
Allows doctors to request new exercises to be added to the exercise library by an administrator. The screen has two tabs:

- **New Request:** A form with fields for exercise name, description, and an optional reference URL.
- **My Requests:** A list of previously submitted requests showing their current status (pending, approved, rejected) and any admin feedback.

Requests are submitted to `/exercise-requests` and retrieved from `/exercise-requests/my`.

#### MoreScreen
A secondary menu screen accessible from the bottom navigation bar. Provides links to NotificationsScreen, SettingsScreen, ExerciseRequestScreen, SessionHistoryScreen, and a logout action.

#### SettingsScreen
User account and application preferences. Organized into four groups:

- **Account:** Edit Profile, Change Password, Push Notifications toggle
- **Preferences:** Language selector, Dark Mode toggle, Units selector
- **Support and Legal:** Help Center, Privacy Policy, Terms of Service
- **Danger Zone:** Delete Account, Log Out

The Dark Mode toggle invokes `toggleTheme` from the theme context, which persists the selection to AsyncStorage and immediately recomputes all styles.

---

## Navigation

All navigable destinations are enumerated in `src/types/index.ts` as the `Screen` union type:

```
splash | onboarding | welcome | dashboard | patients | patient-detail |
programs | edit-program | exercise-detail | deviations | progress | more |
settings | signup | login | notifications | add-patient | add-program |
session-history | exercise-request | live-session
```

Screens that require parameters receive them via the `NavParams` type, which defines optional `patientId` and `programId` fields alongside an index signature for future extensibility.

The bottom navigation bar is rendered by the `BottomNav` component and is visible only when the user is authenticated and not on an authentication screen. It provides five tabs: Home (dashboard), Patients, Programs, Progress, and More. Sub-screens such as `patient-detail`, `edit-program`, `exercise-detail`, and `deviations` are considered extensions of their parent tab and highlight the appropriate tab item while active.

An authentication guard in `App.tsx` redirects to the login screen if the authentication state is cleared while the user is on a protected screen.

---

## Services Layer

### api.ts

All network communication is handled through a configured Axios instance exported as `api`. The base URL is determined by the `EXPO_PUBLIC_API_URL` environment variable, falling back to a hardcoded local IP address.

#### Request Interceptor

Reads the `mc_doctor_token` from AsyncStorage and attaches it as a `Bearer` Authorization header on every outgoing request.

#### Response Interceptor

Handles HTTP 401 responses with automatic token refresh:
1. Retrieves the `mc_doctor_refresh_token` from AsyncStorage.
2. Sends a POST request to `/auth/refresh`.
3. If successful, updates both tokens in AsyncStorage and retries the original request.
4. If the refresh fails, removes all stored tokens and invokes the global `onUnauthorized` callback, which triggers logout.

The `setOnUnauthorized(callback)` function allows `App.tsx` to register the logout handler synchronously during render.

#### Service Modules

**AuthService**
- `login(credentials)` — Authenticates the doctor and stores access and refresh tokens.
- `register(data)` — Creates a new doctor account.
- `logout()` — Invalidates the refresh token on the server and clears all stored tokens.
- `getToken()` — Returns the stored access token.

**DataService**
- `getPatients()` — Retrieves all patients for the authenticated doctor.
- `createPatient(data)` — Creates a new patient record.
- `getDashboardStats()` — Retrieves aggregate statistics for the dashboard.
- `getProgressStats()` — Retrieves daily and weekly analytics data.
- `getPrograms()` — Retrieves all programs created by the authenticated doctor.
- `createProgram(data)` — Creates a new program with exercises.
- `getProgramsByPatient(patientId)` — Retrieves all programs for a given patient.
- `getActiveProgramByPatient(patientId)` — Retrieves the currently active program for a patient.
- `getProgramById(id)` — Retrieves a single program by ID.
- `updateProgram(id, data)` — Updates program name, active status, or exercise list.
- `getRecentSessions(limit)` — Retrieves the most recent sessions.
- `createSession(data)` — Creates a new session record.
- `getSessionById(id)` — Retrieves a session by ID.
- `getExercises()` — Retrieves the full exercise library.
- `getPatientById(id)` — Retrieves a single patient by ID.

**ExerciseRequestService**
- `getMyRequests()` — Retrieves all exercise requests submitted by the authenticated doctor.
- `submitRequest(data)` — Submits a new exercise request.

**ExoskeletonService**
- `getSessionState(sessionId)` — Retrieves the current telemetry state of the exoskeleton.
- `startCountdown(sessionId)` — Initiates the pre-session countdown.
- `pauseSession(sessionId)` — Pauses a running session.
- `resumeSession(sessionId)` — Resumes a paused session.
- `stopSession(sessionId)` — Stops a session normally.
- `emergencyStop(sessionId)` — Immediately halts the exoskeleton.

### socket.ts

`SocketService` is a singleton class that manages a single Socket.IO connection. The connection URL is derived from the API URL by stripping the `/api` suffix.

- `connect()` — Opens the connection if not already open. Registers internal connect, disconnect, and catch-all event listeners.
- `disconnect()` — Closes the connection and nullifies the socket reference.
- `emit(event, ...args)` — Sends an event to the server.
- `on(event, callback)` — Registers a listener for a named event.
- `off(event, callback)` — Removes a previously registered listener.

The singleton is exported as `socketService`. `App.tsx` calls `socketService.connect()` when the user authenticates and `socketService.disconnect()` when they log out.

---

## Theme System

The theme system provides a consistent visual language across the application and supports both light and dark modes.

### Color Palettes

Two palettes are defined in `src/theme/colors.ts`:

**Light Theme**
- Background: `#F5F7FA`
- Card: `#FFFFFF`
- Primary (Teal): `#0BC4BC`
- Text: `#1A1A2E`

**Dark Theme**
- Background: `#0B0F19`
- Card: `#161E2D`
- Primary (Teal): `#0BC4BC` (unchanged for brand consistency)
- Text: `#F1F5F9`

Both palettes define the same set of semantic tokens: `background`, `card`, `text`, `textSecondary`, `textMuted`, `border`, `teal`, `tealDark`, `tealLight`, `tealMuted`, `error`, `errorBg`, `warning`, and `success`.

### ThemeContext

`ThemeProvider` wraps the entire application and exposes the following values through the `useTheme` hook:

- `theme` — `'light'` or `'dark'`
- `colors` — the active color palette object
- `styles` — a precomputed `StyleSheet` based on the active colors
- `toggleTheme()` — switches between light and dark and persists the selection
- `setTheme(theme)` — sets a specific theme directly

The selected theme is persisted to AsyncStorage under the key `@theme` and restored on application startup.

### Global Styles

`src/theme/styles.ts` exports `getGlobalStyles(colors)`, a function that returns a `StyleSheet` containing all shared styles used across screens. Styles are recomputed whenever the theme changes, ensuring all components reflect the new palette immediately.

---

## Shared Components

All shared components are exported from `src/components/index.tsx`.

### Avatar

Renders a circular avatar with colored background and two-letter initials. Accepts a `size` prop with values `sm` (32px), `md` (40px), `lg` (48px), and `xl` (64px). The background color and initials string are passed as required props.

### MotionCareLogo

Renders the application logo image inside a circular container. Accepts a `size` prop and a `withBg` boolean that controls whether the container has a white card background with shadow.

### BottomNav

The persistent bottom navigation bar rendered for authenticated screens. Displays five tabs corresponding to the main application sections. Tab highlighting is context-aware: secondary screens are associated with their parent tab (for example, `patient-detail` highlights the Patients tab).

### ShimmerPlaceholder

A loading skeleton component created by calling `createShimmerPlaceholder(LinearGradient)` from the `react-native-shimmer-placeholder` library. Used in DashboardScreen and other data-driven screens to display animated placeholder shapes while API requests are in flight.

---

## Data Types

Defined in `src/types/index.ts`:

### Screen

A string union type enumerating all valid screen identifiers. Used as the type of the `screen` state variable in `App.tsx` and as the argument type for all `onNavigate` callbacks.

### NavParams

An object type for navigation parameters passed between screens:

```typescript
type NavParams = {
  patientId?: number;
  programId?: number;
  [key: string]: any;
};
```

### NavigateFn

A function type combining the screen identifier and optional parameters:

```typescript
type NavigateFn = (screen: Screen, params?: NavParams) => void;
```

---

## Authentication Flow

```
Application Start
       |
       v
Load AsyncStorage (token, refreshToken, onboardingDone, registered)
       |
       +-- Has refreshToken? --> Attempt token refresh via /auth/refresh
       |
       v
Show SplashScreen (animation plays)
       |
       v
SplashScreen animation complete
       |
       +-- isAuthenticated? -------> Dashboard
       |
       +-- onboarding not done? ---> OnboardingScreen -> WelcomeScreen
       |
       +-- not registered? --------> WelcomeScreen -> SignUpScreen
       |
       +-- registered? ------------> LoginScreen
```

Token refresh is attempted proactively during application initialization. If a valid access token exists alongside a refresh token, the refresh is attempted before navigating to the dashboard. This avoids the common pattern of landing on the dashboard only to immediately receive a 401 error.

AsyncStorage keys used by the authentication system:

| Key | Description |
|---|---|
| `mc_doctor_token` | JWT access token |
| `mc_doctor_refresh_token` | JWT refresh token |
| `mc_doctor_profile` | Serialized doctor profile object |
| `mc_onboarding_done` | Whether the onboarding flow has been completed |
| `mc_registered` | Whether the user has completed registration |

---

## Real-Time Communication

The Socket.IO connection lifecycle is tied to the authentication state:

- `socketService.connect()` is called when `isAuthenticated` becomes `true`.
- `socketService.disconnect()` is called when `isAuthenticated` becomes `false` (logout or session expiry).

### Events

**Emitted by the mobile client:**

| Event | Payload | Description |
|---|---|---|
| `join_session` | `sessionId: number` | Subscribe to telemetry for a specific session |
| `leave_session` | `sessionId: number` | Unsubscribe from session telemetry |

**Received by the mobile client:**

| Event | Description |
|---|---|
| `patient:created` | A new patient has been added; triggers dashboard refresh |
| `patient:updated` | A patient record has been modified; triggers dashboard refresh |
| `patient:deleted` | A patient has been removed; triggers dashboard refresh |
| `session:created` | A new session has been created; triggers dashboard refresh |
| `session:updated` | A session has changed state; updates LiveSessionScreen |
| `session:deleted` | A session has been removed; triggers dashboard refresh |
| `exo:update` | Live telemetry data from the exoskeleton device |

---

## Build and Deployment

Builds are managed with Expo Application Services (EAS). Three build profiles are defined in `eas.json`:

| Profile | Distribution | Android Output | Purpose |
|---|---|---|---|
| development | internal | APK | Local development with development client |
| preview | internal | APK | Internal testing and QA |
| production | store | App Bundle (AAB) | Google Play Store submission |

A pre-built development APK is present in the repository root as `build-1784650507752.apk`.

---

## Environment Configuration

The application reads configuration from a `.env` file at the project root. The following variable is supported:

| Variable | Description | Default |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Full base URL of the REST API including the `/api` path segment | `http://172.16.3.204:5000/api` |

All variables prefixed with `EXPO_PUBLIC_` are embedded into the application bundle at build time and are accessible at runtime via `process.env`.

The Socket.IO server URL is derived automatically from `EXPO_PUBLIC_API_URL` by removing the trailing `/api` segment.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- Expo CLI (`npm install -g expo-cli`)
- For Android: Android Studio with an emulator or a physical device with USB debugging enabled
- For iOS: Xcode on macOS

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd motioncare

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root and set the API base URL:

```
EXPO_PUBLIC_API_URL=http://<your-backend-host>:<port>/api
```

Replace `<your-backend-host>` and `<port>` with the address of the running backend server. When using a physical device, the host must be the LAN IP address of the machine running the backend, not `localhost`.

### Running the Application

```bash
# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in a web browser
npm run web
```

### Building with EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build a preview APK
eas build --profile preview --platform android

# Build a production bundle
eas build --profile production --platform android
```

---

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
