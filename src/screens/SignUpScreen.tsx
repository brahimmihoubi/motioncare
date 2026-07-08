import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';
import { ChevronLeft, User, Mail, Lock, Building, FileCheck } from 'lucide-react-native';
import { Screen } from '../types';
import { useTheme } from '../theme/ThemeContext';

export default function SignUpScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { styles, colors } = useTheme();
  const localStyles = getLocalStyles(colors);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clinic, setClinic] = useState("");
  const [license, setLicense] = useState("");

  const handleSignUp = () => {
    // In a real app, handle authentication and user creation here
    onNavigate("dashboard");
  };

  return (
    <SafeAreaView style={styles.safeContainerWhite}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={localStyles.header}>
          <TouchableOpacity 
            onPress={() => onNavigate("welcome")}
            style={localStyles.backButton}
          >
            <ChevronLeft size={24} color="#1A1A2E" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.scrollContent}
        >
          <View style={localStyles.titleContainer}>
            <Text style={localStyles.title}>Create Doctor Account</Text>
            <Text style={localStyles.subtitle}>
              Sign up to start managing your patients and rehabilitation programs.
            </Text>
          </View>

          <View style={localStyles.formContainer}>
            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>Full Name</Text>
              <View style={localStyles.inputWrapper}>
                <User size={20} color="#8A94A6" />
                <TextInput 
                  style={localStyles.input}
                  placeholder="Dr. Jane Doe"
                  placeholderTextColor="#A0ABC0"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>Email Address</Text>
              <View style={localStyles.inputWrapper}>
                <Mail size={20} color="#8A94A6" />
                <TextInput 
                  style={localStyles.input}
                  placeholder="doctor@clinic.com"
                  placeholderTextColor="#A0ABC0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>Password</Text>
              <View style={localStyles.inputWrapper}>
                <Lock size={20} color="#8A94A6" />
                <TextInput 
                  style={localStyles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#A0ABC0"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>Clinic / Hospital</Text>
              <View style={localStyles.inputWrapper}>
                <Building size={20} color="#8A94A6" />
                <TextInput 
                  style={localStyles.input}
                  placeholder="MotionCare Rehab Center"
                  placeholderTextColor="#A0ABC0"
                  value={clinic}
                  onChangeText={setClinic}
                />
              </View>
            </View>

            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>Medical License Number</Text>
              <View style={localStyles.inputWrapper}>
                <FileCheck size={20} color="#8A94A6" />
                <TextInput 
                  style={localStyles.input}
                  placeholder="MD-12345678"
                  placeholderTextColor="#A0ABC0"
                  value={license}
                  onChangeText={setLicense}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={localStyles.submitButton}
            activeOpacity={0.8}
            onPress={handleSignUp}
          >
            <Text style={localStyles.submitButtonText}>Create Account</Text>
          </TouchableOpacity>
          
          <View style={localStyles.footer}>
            <Text style={localStyles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => onNavigate("welcome")}>
              <Text style={localStyles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getLocalStyles = (colors: any) => StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 35,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_800ExtraBold",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A94A6",
    fontFamily: "Poppins_400Regular",
    lineHeight: 22,
  },
  formContainer: {
    gap: 20,
    marginBottom: 35,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#1A1A2E",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#1A1A2E",
  },
  submitButton: {
    backgroundColor: colors.teal,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    fontSize: 14,
    color: "#8A94A6",
    fontFamily: "Poppins_500Medium",
  },
  footerLink: {
    fontSize: 14,
    color: colors.teal,
    fontFamily: "Poppins_700Bold",
  }
});
