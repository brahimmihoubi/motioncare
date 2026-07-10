import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, User, Mail, Lock, Stethoscope, FileText, Calendar } from 'lucide-react-native';
import { Screen } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';

export default function AddPatientScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { styles, colors } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterPatient = async () => {
    if (!name || !email || !password || !age) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await DataService.createPatient({
        name,
        email,
        password,
        age: parseInt(age),
        notes
      });
      
      // Success! Go back to patients list
      onNavigate('patients');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to register patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={localStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={localStyles.header}>
            <TouchableOpacity 
              onPress={() => onNavigate("patients")}
              style={localStyles.backButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={localStyles.content}>
            <Text style={[localStyles.title, { color: colors.text }]}>Add Patient</Text>
            <Text style={[localStyles.subtitle, { color: colors.textSecondary }]}>
              Register a new patient to your clinic
            </Text>

            {error ? (
              <View style={localStyles.errorBox}>
                <Text style={localStyles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Form */}
            <View style={localStyles.form}>
              
              {/* Full Name */}
              <View style={localStyles.inputGroup}>
                <Text style={[localStyles.inputLabel, { color: colors.text }]}>Full Name *</Text>
                <View style={[localStyles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <User size={18} color="#8A94A6" />
                  <TextInput 
                    style={[localStyles.input, { color: colors.text }]}
                    placeholder="John Doe"
                    placeholderTextColor="#8A94A6"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={localStyles.inputGroup}>
                <Text style={[localStyles.inputLabel, { color: colors.text }]}>Email Address *</Text>
                <View style={[localStyles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Mail size={18} color="#8A94A6" />
                  <TextInput 
                    style={[localStyles.input, { color: colors.text }]}
                    placeholder="patient@example.com"
                    placeholderTextColor="#8A94A6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={localStyles.inputGroup}>
                <Text style={[localStyles.inputLabel, { color: colors.text }]}>Initial Password *</Text>
                <View style={[localStyles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Lock size={18} color="#8A94A6" />
                  <TextInput 
                    style={[localStyles.input, { color: colors.text }]}
                    placeholder="••••••••"
                    placeholderTextColor="#8A94A6"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              {/* Age */}
              <View style={localStyles.inputGroup}>
                <Text style={[localStyles.inputLabel, { color: colors.text }]}>Age *</Text>
                <View style={[localStyles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Calendar size={18} color="#8A94A6" />
                  <TextInput 
                    style={[localStyles.input, { color: colors.text }]}
                    placeholder="e.g. 45"
                    placeholderTextColor="#8A94A6"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                  />
                </View>
              </View>

              {/* Notes */}
              <View style={localStyles.inputGroup}>
                <Text style={[localStyles.inputLabel, { color: colors.text }]}>Initial Notes (Optional)</Text>
                <View style={[localStyles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'flex-start', paddingTop: 12, height: 100 }]}>
                  <FileText size={18} color="#8A94A6" />
                  <TextInput 
                    style={[localStyles.input, { color: colors.text, textAlignVertical: 'top', height: 80 }]}
                    placeholder="Condition description, medical history, etc."
                    placeholderTextColor="#8A94A6"
                    multiline
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[localStyles.submitButton, { backgroundColor: colors.teal }]}
                onPress={handleRegisterPatient}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={localStyles.submitButtonText}>Register Patient</Text>
                )}
              </TouchableOpacity>
              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_800ExtraBold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginBottom: 30,
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  errorBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30'
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  }
});
