import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { ChevronLeft, Mail, Lock } from 'lucide-react-native';
import { Screen } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { AuthService } from '../services/api';

export default function LoginScreen({ onNavigate, onLoginSuccess }: { onNavigate: (s: Screen) => void, onLoginSuccess: () => void }) {
  const { styles, colors } = useTheme();
  const localStyles = getLocalStyles(colors);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await AuthService.login({ email, password });
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainerWhite}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={localStyles.header}>
          <TouchableOpacity 
            onPress={() => onNavigate("welcome")}
            style={localStyles.backButton}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={localStyles.content}>
          <View style={localStyles.titleContainer}>
            <Text style={localStyles.title}>Welcome Back</Text>
            <Text style={localStyles.subtitle}>
              Sign in to continue your rehabilitation journey.
            </Text>
          </View>

          <View style={localStyles.formContainer}>
            {error ? (
              <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text>
            ) : null}
            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>Email Address</Text>
              <View style={localStyles.inputWrapper}>
                <Mail size={20} color="#8A94A6" />
                <TextInput 
                  style={localStyles.input}
                  placeholder="patient@example.com"
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
          </View>

          <TouchableOpacity 
            style={localStyles.submitButton}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={localStyles.submitButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
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
  content: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 35,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_800ExtraBold",
    color: colors.text,
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
    color: colors.text,
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
    color: colors.text,
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
});
