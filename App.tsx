import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { Screen, NavParams } from './src/types';
import { BottomNav } from './src/components';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

// Import Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PatientsScreen from './src/screens/PatientsScreen';
import PatientDetailScreen from './src/screens/PatientDetailScreen';
import ProgramsScreen from './src/screens/ProgramsScreen';
import EditProgramScreen from './src/screens/EditProgramScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import DeviationsScreen from './src/screens/DeviationsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import MoreScreen from './src/screens/MoreScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import AddPatientScreen from './src/screens/AddPatientScreen';
import AddProgramScreen from './src/screens/AddProgramScreen';
import SessionHistoryScreen from './src/screens/SessionHistoryScreen';
import ExerciseRequestScreen from './src/screens/ExerciseRequestScreen';
import LiveSessionScreen from './src/screens/LiveSessionScreen';
import { AuthService, setOnUnauthorized, api, API_URL } from './src/services/api';
import { socketService } from './src/services/socket';
import axios from 'axios';

// AsyncStorage keys
const KEY_ONBOARDING_DONE = 'mc_onboarding_done';
const KEY_REGISTERED = 'mc_registered';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [navParams, setNavParams] = useState<NavParams>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  /** Navigate with optional params */
  const navigate = (s: Screen, params?: NavParams) => {
    if (params) setNavParams(params);
    setScreen(s);
  };
  const { theme, colors, styles } = useTheme();

  // Register the global 401 handler IMMEDIATELY (not in useEffect)
  // so it's available before any child component's effects fire API calls.
  // useCallback-like stable ref pattern via module-level setter.
  const doLogout = React.useCallback(() => {
    AuthService.logout().then(() => {
      setIsAuthenticated(false);
      setScreen('login');
    });
  }, []);

  // Register the global unauthorized handler synchronously on first render
  React.useMemo(() => { setOnUnauthorized(doLogout); }, [doLogout]);

  /**
   * On mount: validate token, attempt proactive refresh if needed,
   * then decide which screen follows the splash.
   */
  useEffect(() => {
    const init = async () => {
      try {
        const [token, refreshToken, obDone, reg] = await Promise.all([
          AsyncStorage.getItem('mc_doctor_token'),
          AsyncStorage.getItem('mc_doctor_refresh_token'),
          AsyncStorage.getItem(KEY_ONBOARDING_DONE),
          AsyncStorage.getItem(KEY_REGISTERED),
        ]);

        if (obDone === 'true') setOnboardingDone(true);
        if (reg === 'true') setIsRegistered(true);

        if (token) {
          // Pre-load token into axios so it's set synchronously before
          // the first API request fires (interceptor is async, this is sync).
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Proactively try to refresh using the refresh token so the
          // dashboard never hits a 401 on its first load.
          if (refreshToken) {
            try {
              const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
              const newAccess = res.data?.data?.accessToken;
              const newRefresh = res.data?.data?.refreshToken;
              if (newAccess) {
                await AsyncStorage.setItem('mc_doctor_token', newAccess);
                if (newRefresh) await AsyncStorage.setItem('mc_doctor_refresh_token', newRefresh);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
              }
            } catch {
              // Refresh failed — keep using the existing token; the
              // 401 interceptor will handle it if the token is expired.
            }
          }
          setIsAuthenticated(true);
        } else if (refreshToken) {
          // No access token but have refresh token → try to restore session
          try {
            const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            const newAccess = res.data?.data?.accessToken;
            const newRefresh = res.data?.data?.refreshToken;
            if (newAccess) {
              await AsyncStorage.setItem('mc_doctor_token', newAccess);
              if (newRefresh) await AsyncStorage.setItem('mc_doctor_refresh_token', newRefresh);
              api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
              setIsAuthenticated(true);
            }
          } catch {
            // Both tokens invalid — stay unauthenticated
            await AsyncStorage.multiRemove(['mc_doctor_token', 'mc_doctor_refresh_token', 'mc_doctor_profile']);
          }
        }
      } catch (e) {
        console.warn('Failed to read AsyncStorage during init', e);
      } finally {
        setAppReady(true);
      }
    };
    init();
  }, []);

  /** Called by SplashScreen when its animation finishes */
  const handleSplashDone = () => {
    if (isAuthenticated) {
      setScreen('dashboard');
    } else if (!onboardingDone) {
      setScreen('onboarding');
    } else if (!isRegistered) {
      // Onboarding already seen, but never registered → show welcome/signup
      setScreen('welcome');
    } else {
      // Has registered before → show login directly
      setScreen('login');
    }
  };

  /** Called when onboarding finishes or is skipped */
  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem(KEY_ONBOARDING_DONE, 'true');
    setOnboardingDone(true);
    // Go to signup if not yet registered, otherwise login
    setScreen(isRegistered ? 'login' : 'welcome');
  };

  /** Called after a successful registration + login */
  const handleRegistrationSuccess = async () => {
    await AsyncStorage.setItem(KEY_REGISTERED, 'true');
    setIsRegistered(true);
    setIsAuthenticated(true);
    setScreen('dashboard');
  };

  /** Called after a successful login */
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setScreen('dashboard');
  };

  /** Called from Settings / logout or 401 interceptor */
  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setScreen('login'); // After logout always go to login (registration already done)
  };

  // Global 401 handler is now registered via useMemo above (synchronous).

  // Manage socket connection globally
  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }
    
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onDone={appReady ? handleSplashDone : () => {}} />;

      case 'onboarding':
        return (
          <OnboardingScreen
            onFinish={handleOnboardingComplete}
            onSkip={handleOnboardingComplete}
          />
        );

      case 'welcome':
        return <WelcomeScreen onNavigate={setScreen} />;

      case 'signup':
        return (
          <SignUpScreen
            onNavigate={setScreen}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onNavigate={setScreen}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case 'dashboard':
        return <DashboardScreen onNavigate={navigate} onLogout={handleLogout} />;

      case 'patients':
        return <PatientsScreen onNavigate={navigate} />;

      case 'patient-detail':
        return <PatientDetailScreen onNavigate={navigate} patientId={navParams.patientId} />;

      case 'programs':
        return <ProgramsScreen onNavigate={navigate} />;

      case 'edit-program':
        return <EditProgramScreen onNavigate={navigate} programId={navParams.programId} />;

      case 'exercise-detail':
        return <ExerciseDetailScreen onNavigate={navigate} />;

      case 'deviations':
        return <DeviationsScreen onNavigate={navigate} />;

      case 'progress':
        return <ProgressScreen />;

      case 'more':
        return <MoreScreen onNavigate={navigate} onLogout={handleLogout} />;

      case 'settings':
        return <SettingsScreen onNavigate={navigate} onLogout={handleLogout} />;

      case 'notifications':
        return <NotificationsScreen onNavigate={navigate} />;

      case 'add-patient':
        return <AddPatientScreen onNavigate={navigate} />;

      case 'add-program':
        return <AddProgramScreen onNavigate={navigate} />;

      case 'session-history':
        return <SessionHistoryScreen onNavigate={navigate} />;

      case 'exercise-request':
        return <ExerciseRequestScreen onNavigate={navigate} />;

      case 'live-session':
        return <LiveSessionScreen onNavigate={navigate} sessionId={navParams.sessionId} />;

      default:
        return <DashboardScreen onNavigate={navigate} onLogout={handleLogout} />;
    }
  };

  const authScreens = ['splash', 'onboarding', 'welcome', 'signup', 'login'];
  const showNav = isAuthenticated && !authScreens.includes(screen);

  // Guard: if not authenticated and on a protected screen, redirect to login
  useEffect(() => {
    if (!isAuthenticated && !authScreens.includes(screen)) {
      setScreen('login');
    }
  }, [isAuthenticated, screen]);

  const isLightStatusBar = screen === 'splash' || screen === 'welcome';

  return (
    <View style={styles.appContainer}>
      <StatusBar
        backgroundColor={isLightStatusBar ? colors.teal : colors.card}
        barStyle={
          isLightStatusBar
            ? 'light-content'
            : theme === 'dark'
            ? 'light-content'
            : 'dark-content'
        }
      />
      <View style={styles.mainContentContainer}>{renderScreen()}</View>
      {showNav ? <BottomNav current={screen} onNavigate={navigate} /> : null}
    </View>
  );
}


export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
