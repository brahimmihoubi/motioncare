import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ChevronLeft, ChevronRight, Edit3, Activity, User, Clock, CheckCircle } from 'lucide-react-native';
import { NavigateFn } from '../types';
import { Avatar } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';

export default function PatientDetailScreen({
  onNavigate,
  patientId,
}: {
  onNavigate: NavigateFn;
  patientId?: number;
}) {
  const { styles, colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (!patientId) {
      Alert.alert('Error', 'No patient selected.');
      onNavigate('patients');
      return;
    }
    const load = async () => {
      try {
        setIsLoading(true);
        // Fetch patient details and active program in parallel
        const [patientRes, programRes] = await Promise.all([
          DataService.getPatientById(patientId),
          DataService.getActiveProgramByPatient(patientId).catch(() => ({ success: false, data: null })),
        ]);
        if (patientRes.success) setPatient(patientRes.data);
        if (programRes.success) setActiveProgram(programRes.data);
      } catch (err) {
        console.error('Failed to load patient detail', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [patientId]);

  // Compute progress ring value
  const exerciseCount = activeProgram?.exercises?.length || 0;
  const completionPct = activeProgram ? Math.min(100, exerciseCount * 10) : 0; // Rough proxy
  const ringCircumference = 2 * Math.PI * 15;
  const ringDash = ringCircumference * (completionPct / 100);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={[styles.detailHeader]}>
          <TouchableOpacity onPress={() => onNavigate('patients')} style={styles.circleBtnSmall}>
            <ChevronLeft size={18} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>Patient Details</Text>
          <View style={styles.circleBtnSmall} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      </SafeAreaView>
    );
  }

  if (!patient) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => onNavigate('patients')} style={styles.circleBtnSmall}>
            <ChevronLeft size={18} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>Patient Details</Text>
          <View style={styles.circleBtnSmall} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Patient data could not be loaded. Please try again.
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.teal, marginTop: 20 }]}
            onPress={() => onNavigate('patients')}
          >
            <Text style={styles.ctaBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const initials = patient.name?.substring(0, 2).toUpperCase() || 'PT';

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => onNavigate('patients')} style={styles.circleBtnSmall}>
          <ChevronLeft size={18} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Patient Details</Text>
        <View style={styles.circleBtnSmall}>
          <Edit3 size={16} color={colors.teal} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Profile Card */}
        <View style={styles.detailProfileCard}>
          <View style={styles.profileCardHeader}>
            <Avatar initials={initials} color={colors.teal} size="xl" />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.profileCardName}>{patient.name}</Text>
              <Text style={styles.profileCardDoctor}>{patient.email}</Text>
              {patient.notes ? (
                <View style={styles.profileCardBadge}>
                  <Text style={styles.profileCardBadgeText} numberOfLines={1}>{patient.notes}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Grid Stats */}
          <View style={styles.profileStatsRow}>
            {[
              { label: 'Age', value: patient.age || 'N/A' },
              { label: 'Program', value: activeProgram ? 'Active' : 'None' },
              { label: 'Exercises', value: exerciseCount },
            ].map((s, idx) => (
              <View key={idx} style={styles.profileStatCol}>
                <Text style={styles.profileStatVal}>{s.value}</Text>
                <Text style={styles.profileStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Active Program Progress Ring */}
        {activeProgram ? (
          <View style={styles.progressRingCard}>
            <View style={styles.ringSvgContainer}>
              <Svg width={70} height={70} viewBox="0 0 36 36">
                <Circle cx="18" cy="18" r="15" fill="none" stroke="#EEF2F6" strokeWidth="3" />
                <Circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke={colors.teal}
                  strokeWidth="3"
                  strokeDasharray={[ringDash, ringCircumference - ringDash]}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </Svg>
              <View style={styles.ringTextAbs}>
                <Text style={styles.ringTextVal}>{exerciseCount}</Text>
              </View>
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.ringCardTitle}>Active Program</Text>
              <Text style={styles.ringCardSubtitle}>{activeProgram.name}</Text>
              <Text style={styles.ringCardCount}>{exerciseCount} exercises assigned</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.progressRingCard, { justifyContent: 'center' }]}>
            <Activity size={24} color={colors.textMuted} />
            <Text style={[styles.ringCardTitle, { marginLeft: 12, color: colors.textMuted }]}>
              No active program assigned
            </Text>
          </View>
        )}

        {/* Exercise List from Active Program */}
        {activeProgram && activeProgram.exercises && activeProgram.exercises.length > 0 && (
          <View style={styles.recommendationsCard}>
            <View style={styles.recommendationsHeader}>
              <Text style={styles.recommendationsTitle}>Program Exercises</Text>
              <TouchableOpacity
                onPress={() => activeProgram && onNavigate('edit-program', { programId: activeProgram.id })}
              >
                <Text style={[styles.viewDeviationsText]}>Edit</Text>
              </TouchableOpacity>
            </View>
            {activeProgram.exercises.map((ex: any, i: number) => (
              <View key={i} style={styles.deviationMiniItem}>
                <CheckCircle size={14} color={colors.teal} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviationMiniTitle}>{ex.name}</Text>
                  <Text style={styles.deviationMiniDate}>
                    {ex.sets} sets · {ex.repetitions} reps
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Patient Notes */}
        {patient.notes ? (
          <View style={styles.recommendationsCard}>
            <View style={styles.recommendationsHeader}>
              <Text style={styles.recommendationsTitle}>Clinical Notes</Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.recommendationText}>{patient.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Action Button */}
        <TouchableOpacity
          onPress={() =>
            activeProgram
              ? onNavigate('edit-program', { programId: activeProgram.id })
              : onNavigate('add-program')
          }
          style={[styles.ctaBtn, { backgroundColor: colors.teal, marginVertical: 10 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>
            {activeProgram ? 'Edit Program' : 'Assign Program'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
