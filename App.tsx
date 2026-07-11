import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { Screen, NavParams } from './src/types';
import { BottomNav } from './src/components';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import { AuthService, setOnUnauthorized } from './src/services/api';
import { socketService } from './src/services/socket';

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

  /**
   * On mount: check AsyncStorage for token, onboarding flag, and
   * registered flag to decide which screen follows the splash.
   */
  useEffect(() => {
    const init = async () => {
      try {
        const [token, obDone, reg] = await Promise.all([
          AuthService.getToken(),
          AsyncStorage.getItem(KEY_ONBOARDING_DONE),
          AsyncStorage.getItem(KEY_REGISTERED),
        ]);

        if (token) {
          // Already logged in → go straight to dashboard after splash
          setIsAuthenticated(true);
        }

        if (obDone === 'true') setOnboardingDone(true);
        if (reg === 'true') setIsRegistered(true);
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

  // Register the global 401 handler so any stale-token request auto-logs out
  useEffect(() => {
    setOnUnauthorized(() => {
      AuthService.logout().then(() => {
        setIsAuthenticated(false);
        setScreen('login');
      });
    });
  }, []);

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
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
