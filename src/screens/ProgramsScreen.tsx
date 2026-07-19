import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, Plus, Activity, Clock } from 'lucide-react-native';
import { NavigateFn } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';

export default function ProgramsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const { styles, colors } = useTheme();
  const [tab, setTab] = useState("Active");
  const [programsList, setProgramsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await DataService.getPrograms();
      setProgramsList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load programs", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const filtered = programsList.filter((prog) => {
    if (tab === "Active") return prog.active === 1 || prog.active === true;
    if (tab === "Completed") return prog.active === 0 || prog.active === false;
    return true; // Draft or All
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <Text style={[styles.titleText, { flex: 1, paddingLeft: 10 }]}>Programs</Text>
        <TouchableOpacity style={styles.addBtnContainer} onPress={() => onNavigate("add-program")}>
          <Plus size={18} color={colors.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Sub-tabs */}
        <View style={styles.tabsRow}>
          {["Active", "Completed", "All"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabBtn, tab === t && { backgroundColor: colors.teal }]}
            >
              <Text style={[styles.tabBtnText, { color: tab === t ? "white" : "#8A94A6" }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Programs List */}
        <View style={styles.dashboardList}>
          {isLoading ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>Loading programs...</Text>
          ) : filtered.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>No programs found. Tap + to create one.</Text>
          ) : (
            filtered.map((prog) => (
              <TouchableOpacity
                key={prog.id}
                onPress={() => onNavigate('edit-program', { programId: prog.id })}
                style={styles.programItemCard}
                activeOpacity={0.7}
              >
                <View style={[styles.programIconBox, { backgroundColor: prog.active ? 'rgba(0,229,255,0.15)' : 'rgba(0,0,0,0.05)' }]}>
                  <Activity size={22} color={prog.active ? colors.teal : '#8A94A6'} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.programNameText}>{prog.name}</Text>
                  <Text style={styles.programPatientText}>Patient: {prog.patientName || 'Unknown'}</Text>
                  <View style={styles.programDetailsRow}>
                    <View style={styles.programMetaInline}>
                      <Activity size={12} color={colors.teal} />
                      <Text style={styles.programMetaText}>{prog.exerciseCount || 0} exercises</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={18} color="#CBD5E0" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
