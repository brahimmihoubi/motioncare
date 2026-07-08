import React, { useState } from 'react';
import { View, StatusBar, Text, TextInput } from 'react-native';
import { Screen } from './src/types';
import { BottomNav } from './src/components';
import { styles } from './src/theme/styles';
import { TEAL } from './src/theme/colors';

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


export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");

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

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <SplashScreen onDone={() => setScreen("onboarding")} />;
      case "onboarding": return <OnboardingScreen onFinish={() => setScreen("welcome")} onSkip={() => setScreen("welcome")} />;
      case "welcome": return <WelcomeScreen onNavigate={setScreen} />;
      case "dashboard": return <DashboardScreen onNavigate={setScreen} />;
      case "signup": return <SignUpScreen onNavigate={setScreen} />;
      case "patients": return <PatientsScreen onNavigate={setScreen} />;
      case "patient-detail": return <PatientDetailScreen onNavigate={setScreen} />;
      case "programs": return <ProgramsScreen onNavigate={setScreen} />;
      case "edit-program": return <EditProgramScreen onNavigate={setScreen} />;
      case "exercise-detail": return <ExerciseDetailScreen onNavigate={setScreen} />;
      case "deviations": return <DeviationsScreen onNavigate={setScreen} />;
      case "progress": return <ProgressScreen />;
      case "more": return <MoreScreen onNavigate={setScreen} />;
      case "settings": return <SettingsScreen onNavigate={setScreen} />;
      case "notifications": return <NotificationsScreen onNavigate={setScreen} />;
      default: return <DashboardScreen onNavigate={setScreen} />;
    }
  };

  const showNav = screen !== "splash" && screen !== "onboarding" && screen !== "welcome";

  return (
    <View style={styles.appContainer}>
      <StatusBar
        backgroundColor={screen === "splash" || screen === "welcome" ? TEAL : "white"}
        barStyle={screen === "splash" || screen === "welcome" ? "light-content" : "dark-content"}
      />
      <View style={styles.mainContentContainer}>
        {renderScreen()}
      </View>
      {showNav && <BottomNav current={screen} onNavigate={setScreen} />}
    </View>
  );
}
