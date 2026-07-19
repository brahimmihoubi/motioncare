import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal, FlatList
} from 'react-native';
import { ChevronLeft, Plus, Minus, Check, X, Save } from 'lucide-react-native';
import { NavigateFn } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';

interface Exercise {
  id?: number;         // program_exercise id
  exercise_id: number; // library exercise id
  name: string;
  sets: number;
  repetitions: number;
  notes?: string;
}

export default function EditProgramScreen({
  onNavigate,
  programId,
}: {
  onNavigate: NavigateFn;
  programId?: number;
}) {
  const { styles, colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [programName, setProgramName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [allExercises, setAllExercises] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!programId) {
      Alert.alert('Error', 'No program selected.');
      onNavigate('programs');
      return;
    }
    const load = async () => {
      try {
        setIsLoading(true);
        const [progRes, exRes] = await Promise.all([
          DataService.getProgramById(programId),
          DataService.getExercises(),
        ]);
        if (progRes.success && progRes.data) {
          setProgramName(progRes.data.name || '');
          setIsActive(progRes.data.active === 1 || progRes.data.active === true);
          const mapped: Exercise[] = (progRes.data.exercises || []).map((pe: any) => ({
            id: pe.id,
            exercise_id: pe.exercise_id,
            name: pe.name,
            sets: pe.sets || 3,
            repetitions: pe.repetitions || 10,
            notes: pe.notes || '',
          }));
          setExercises(mapped);
        }
        if (exRes.success) setAllExercises(exRes.data || []);
      } catch (err) {
        console.error('Failed to load program', err);
        Alert.alert('Error', 'Failed to load program data.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [programId]);

  const handleSave = async () => {
    if (!programId) return;
    if (!programName.trim()) {
      Alert.alert('Validation', 'Program name cannot be empty.');
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        name: programName.trim(),
        active: isActive,
        exercises: exercises.map((ex) => ({
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          repetitions: ex.repetitions,
          notes: ex.notes || '',
        })),
      };
      const res = await DataService.updateProgram(programId, payload);
      if (res.success) {
        Alert.alert('Saved!', 'Program updated successfully.', [
          { text: 'OK', onPress: () => onNavigate('programs') },
        ]);
      } else {
        Alert.alert('Error', res.message || 'Failed to save program.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save program.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addExercise = (libraryExercise: any) => {
    // Check if already added
    if (exercises.find((e) => e.exercise_id === libraryExercise.id)) {
      Alert.alert('Already added', `"${libraryExercise.name}" is already in this program.`);
      return;
    }
    setExercises((prev) => [
      ...prev,
      {
        exercise_id: libraryExercise.id,
        name: libraryExercise.name,
        sets: 3,
        repetitions: 10,
        notes: '',
      },
    ]);
    setShowPicker(false);
  };

  const updateField = (index: number, field: 'sets' | 'repetitions', delta: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        const current = ex[field];
        const next = Math.max(1, current + delta);
        return { ...ex, [field]: next };
      })
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => onNavigate('programs')} style={styles.circleBtnSmall}>
            <ChevronLeft size={18} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>Edit Program</Text>
          <View style={styles.circleBtnSmall} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => onNavigate('programs')} style={styles.circleBtnSmall}>
          <ChevronLeft size={18} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Edit Program</Text>
        <TouchableOpacity
          style={[styles.saveHeaderBtn]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.teal} />
          ) : (
            <Text style={styles.saveHeaderBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Program Info Banner */}
        <View style={styles.editProgramBanner}>
          {/* Program Name Editable */}
          <Text style={[styles.programPatientText, { marginBottom: 6 }]}>Program Name</Text>
          <TextInput
            value={programName}
            onChangeText={setProgramName}
            style={[
              styles.searchInput,
              {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.text,
                backgroundColor: colors.card,
                fontSize: 15,
                fontFamily: 'Poppins_500Medium',
              },
            ]}
            placeholder="Enter program name"
            placeholderTextColor={colors.textMuted}
          />

          {/* Active Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
            <Text style={[styles.programPatientText, { flex: 1 }]}>Status</Text>
            <TouchableOpacity
              onPress={() => setIsActive((v) => !v)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: isActive ? colors.teal : colors.border,
              }}
            >
              <Text style={{ color: 'white', fontSize: 13, fontFamily: 'Poppins_600SemiBold' }}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercises Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercises ({exercises.length})</Text>
          <TouchableOpacity
            style={styles.addExerciseLink}
            onPress={() => setShowPicker(true)}
          >
            <Plus size={12} color={colors.teal} />
            <Text style={styles.addExerciseLinkText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>

        {/* Exercises List */}
        <View style={styles.dashboardList}>
          {exercises.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textMuted, paddingVertical: 30 }}>
              No exercises yet. Tap "Add Exercise" to assign some.
            </Text>
          ) : (
            exercises.map((ex, i) => (
              <View key={i} style={[styles.exerciseListItem, { flexDirection: 'column', alignItems: 'stretch' }]}>
                {/* Top row: icon + name + remove */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.exerciseIconBox}>
                    <Text style={{ fontSize: 18 }}>💪</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.circleMinusBtn}
                    onPress={() => removeExercise(i)}
                  >
                    <X size={12} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>

                {/* Sets / Reps stepper */}
                <View style={{ flexDirection: 'row', marginTop: 10, gap: 12 }}>
                  {(['sets', 'repetitions'] as const).map((field) => (
                    <View
                      key={field}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.background,
                        borderRadius: 10,
                        paddingVertical: 6,
                        paddingHorizontal: 8,
                        justifyContent: 'space-between',
                      }}
                    >
                      <TouchableOpacity onPress={() => updateField(i, field, -1)}>
                        <Minus size={14} color={colors.teal} />
                      </TouchableOpacity>
                      <Text style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>
                        {ex[field]} {field === 'sets' ? 'sets' : 'reps'}
                      </Text>
                      <TouchableOpacity onPress={() => updateField(i, field, 1)}>
                        <Plus size={14} color={colors.teal} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: colors.teal, marginVertical: 20 }]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.ctaBtnText}>Update Program</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Exercise Picker Modal */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 16,
              maxHeight: '75%',
            }}
          >
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>
              <Text style={[styles.detailHeaderTitle, { flex: 1 }]}>Add Exercise</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <X size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={allExercises}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 30 }}>
                  No exercises in library yet.
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.exerciseListItem,
                    { marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
                  ]}
                  onPress={() => addExercise(item)}
                >
                  <View style={styles.exerciseIconBox}>
                    <Text style={{ fontSize: 18 }}>🏋️</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    {item.description ? (
                      <Text style={styles.exerciseRepsMeta} numberOfLines={1}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <Plus size={18} color={colors.teal} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
