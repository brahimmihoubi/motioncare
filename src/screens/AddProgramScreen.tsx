import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { ChevronLeft, User, Activity, Plus, Trash2, Check, X, FileText } from 'lucide-react-native';
import { Screen } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';

export default function AddProgramScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { styles, colors } = useTheme();
  
  const [name, setName] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Selected exercises for the new program
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  
  // Data for selectors
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [exercisesList, setExercisesList] = useState<any[]>([]);
  
  // Modals state
  const [isPatientModalVisible, setPatientModalVisible] = useState(false);
  const [isExerciseModalVisible, setExerciseModalVisible] = useState(false);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [patientsRes, exercisesRes] = await Promise.all([
          DataService.getPatients(),
          DataService.getExercises()
        ]);
        
        setPatientsList(Array.isArray(patientsRes.data) ? patientsRes.data : []);
        setExercisesList(Array.isArray(exercisesRes.data) ? exercisesRes.data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load required data');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleAddExercise = (exercise: any) => {
    // Check if already added
    if (selectedExercises.find(e => e.exercise_id === exercise.id)) {
      setExerciseModalVisible(false);
      return;
    }
    
    setSelectedExercises([
      ...selectedExercises,
      {
        exercise_id: exercise.id,
        name: exercise.name,
        repetitions: 10,
        sets: 3,
        duration: 0,
        rest_between_sets: 60,
      }
    ]);
    setExerciseModalVisible(false);
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...selectedExercises];
    updated[index][field] = parseInt(value) || 0;
    setSelectedExercises(updated);
  };

  const removeExercise = (index: number) => {
    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);
  };

  const handleCreateProgram = async () => {
    if (!name || !selectedPatient || selectedExercises.length === 0) {
      setError('Please fill in program name, select a patient, and add at least one exercise.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await DataService.createProgram({
        name,
        patient_id: selectedPatient.id,
        exercises: selectedExercises
      });
      
      onNavigate('programs');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create program');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={localStyles.header}>
          <TouchableOpacity onPress={() => onNavigate("programs")} style={localStyles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[localStyles.headerTitle, { color: colors.text }]}>Create Program</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={localStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          {isLoadingData ? (
            <ActivityIndicator color={colors.teal} style={{ marginTop: 50 }} />
          ) : (
            <View style={localStyles.content}>
              {error ? (
                <View style={localStyles.errorBox}>
                  <Text style={localStyles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Program Name */}
              <View style={localStyles.inputGroup}>
                <Text style={[localStyles.inputLabel, { color: colors.text }]}>Program Name</Text>
                <View style={[localStyles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <FileText size={18} color="#8A94A6" />
                  <TextInput 
                    style={[localStyles.input, { color: colors.text }]}
                    placeholder="e.g. 4-Week Post-Op Knee Rehab"
                    placeholderTextColor="#8A94A6"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              {/* Patient Selection */}
              <View style={localStyles.inputGroup}>
                <Text style={[localStyles.inputLabel, { color: colors.text }]}>Select Patient</Text>
                <TouchableOpacity 
                  style={[localStyles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setPatientModalVisible(true)}
                >
                  <User size={18} color={selectedPatient ? colors.teal : "#8A94A6"} />
                  <Text style={[localStyles.inputText, { color: selectedPatient ? colors.text : "#8A94A6" }]}>
                    {selectedPatient ? selectedPatient.name : "Tap to select a patient"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Exercises List */}
              <View style={localStyles.exercisesHeader}>
                <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Exercises</Text>
                <TouchableOpacity 
                  style={[localStyles.addExBtn, { backgroundColor: 'rgba(0,229,255,0.1)' }]}
                  onPress={() => setExerciseModalVisible(true)}
                >
                  <Plus size={16} color={colors.teal} />
                  <Text style={[localStyles.addExBtnText, { color: colors.teal }]}>Add</Text>
                </TouchableOpacity>
              </View>

              {selectedExercises.length === 0 ? (
                <View style={[localStyles.emptyExBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Activity size={32} color="#8A94A6" style={{ marginBottom: 10 }} />
                  <Text style={{ color: "#8A94A6", fontFamily: 'Poppins_500Medium' }}>No exercises added yet.</Text>
                </View>
              ) : (
                <View style={{ gap: 12 }}>
                  {selectedExercises.map((ex, index) => (
                    <View key={index.toString()} style={[localStyles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <View style={localStyles.exerciseCardHeader}>
                        <Text style={[localStyles.exerciseCardTitle, { color: colors.text }]}>{ex.name}</Text>
                        <TouchableOpacity onPress={() => removeExercise(index)}>
                          <Trash2 size={18} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={localStyles.exerciseParamsRow}>
                        <View style={localStyles.paramBox}>
                          <Text style={[localStyles.paramLabel, { color: colors.textSecondary }]}>Sets</Text>
                          <TextInput 
                            style={[localStyles.paramInput, { color: colors.text, borderColor: colors.border }]}
                            keyboardType="numeric"
                            value={String(ex.sets)}
                            onChangeText={(val) => updateExercise(index, 'sets', val)}
                          />
                        </View>
                        <View style={localStyles.paramBox}>
                          <Text style={[localStyles.paramLabel, { color: colors.textSecondary }]}>Reps</Text>
                          <TextInput 
                            style={[localStyles.paramInput, { color: colors.text, borderColor: colors.border }]}
                            keyboardType="numeric"
                            value={String(ex.repetitions)}
                            onChangeText={(val) => updateExercise(index, 'repetitions', val)}
                          />
                        </View>
                        <View style={localStyles.paramBox}>
                          <Text style={[localStyles.paramLabel, { color: colors.textSecondary }]}>Rest (s)</Text>
                          <TextInput 
                            style={[localStyles.paramInput, { color: colors.text, borderColor: colors.border }]}
                            keyboardType="numeric"
                            value={String(ex.rest_between_sets)}
                            onChangeText={(val) => updateExercise(index, 'rest_between_sets', val)}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity 
                style={[localStyles.submitButton, { backgroundColor: colors.teal }]}
                onPress={handleCreateProgram}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={localStyles.submitButtonText}>Create Program</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Patient Selection Modal */}
      <Modal visible={isPatientModalVisible} animationType="slide" transparent>
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { backgroundColor: colors.background }]}>
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: colors.text }]}>Select Patient</Text>
              <TouchableOpacity onPress={() => setPatientModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={localStyles.modalScroll}>
              {patientsList.map(p => (
                <TouchableOpacity 
                  key={p.id} 
                  style={[localStyles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setSelectedPatient(p);
                    setPatientModalVisible(false);
                  }}
                >
                  <Text style={[localStyles.modalItemText, { color: colors.text }]}>{p.name}</Text>
                </TouchableOpacity>
              ))}
              {patientsList.length === 0 && (
                <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>No patients found.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Exercise Selection Modal */}
      <Modal visible={isExerciseModalVisible} animationType="slide" transparent>
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { backgroundColor: colors.background }]}>
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: colors.text }]}>Add Exercise</Text>
              <TouchableOpacity onPress={() => setExerciseModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={localStyles.modalScroll}>
              {exercisesList.map(ex => (
                <TouchableOpacity 
                  key={ex.id} 
                  style={[localStyles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleAddExercise(ex)}
                >
                  <Text style={[localStyles.modalItemText, { color: colors.text }]}>{ex.name}</Text>
                  <Plus size={18} color={colors.teal} />
                </TouchableOpacity>
              ))}
              {exercisesList.length === 0 && (
                <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>No exercises found in database.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
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
    gap: 24,
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
  inputText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  addExBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addExBtnText: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyExBox: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseCardTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
  },
  exerciseParamsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  paramBox: {
    flex: 1,
    gap: 4,
  },
  paramLabel: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
  paramInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30'
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  modalScroll: {
    flex: 1,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  }
});
