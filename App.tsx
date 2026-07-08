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

const CustomText = Text as any;
CustomText.defaultProps = CustomText.defaultProps || {};
CustomText.defaultProps.style = { fontFamily: 'Poppins_400Regular' };

const CustomTextInput = TextInput as any;
CustomTextInput.defaultProps = CustomTextInput.defaultProps || {};
CustomTextInput.defaultProps.style = { fontFamily: 'Poppins_400Regular' };

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
      case "welcome": return <WelcomeScreen onStart={() => setScreen("dashboard")} />;
      case "dashboard": return <DashboardScreen onNavigate={setScreen} />;
      case "patients": return <PatientsScreen onNavigate={setScreen} />;
      case "patient-detail": return <PatientDetailScreen onNavigate={setScreen} />;
      case "programs": return <ProgramsScreen onNavigate={setScreen} />;
      case "edit-program": return <EditProgramScreen onNavigate={setScreen} />;
      case "exercise-detail": return <ExerciseDetailScreen onNavigate={setScreen} />;
      case "deviations": return <DeviationsScreen onNavigate={setScreen} />;
      case "progress": return <ProgressScreen />;
      case "more": return <MoreScreen onNavigate={setScreen} />;
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
