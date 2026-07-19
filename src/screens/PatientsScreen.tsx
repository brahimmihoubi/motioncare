import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ChevronRight, Search, Plus } from 'lucide-react-native';
import { NavigateFn } from '../types';
import { Avatar } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';

export default function PatientsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const { styles, colors } = useTheme();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await DataService.getPatients();
        // Assuming DataService returns the raw array or an object where data is the array
        setPatientsList(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load patients", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patientsList.filter((p) => {
    const pName = p.name || '';
    const pNotes = p.notes || '';
    const matchesQuery =
      pName.toLowerCase().includes(query.toLowerCase()) ||
      pNotes.toLowerCase().includes(query.toLowerCase());
    if (tab === "All") return matchesQuery;
    // Map backend data to active/completed if possible, else just show all for now
    return matchesQuery;
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.patientsHeaderContainer}>
        <View style={styles.patientsHeaderRow}>
          <Text style={styles.titleText}>Patients</Text>
          <TouchableOpacity style={styles.addBtnContainer} onPress={() => onNavigate("add-patient")}>
            <Plus size={18} color={colors.teal} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={16} color="#8A94A6" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search patients..."
            placeholderTextColor="#8A94A6"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Tab row */}
        <View style={styles.tabsRow}>
          {["All", "Active", "Completed"].map((t) => {
            const active = tab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tabBtn, active && { backgroundColor: colors.teal }]}
              >
                <Text style={[styles.tabBtnText, { color: active ? "white" : "#8A94A6" }]}>
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detailed patient list */}
        <View style={styles.patientGrid}>
          {isLoading ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>Loading patients...</Text>
          ) : filtered.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>No patients found.</Text>
          ) : (
            filtered.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => onNavigate('patient-detail', { patientId: p.id })}
                style={styles.patientGridCard}
                activeOpacity={0.7}
              >
                <Avatar initials={p.name?.substring(0, 2).toUpperCase() || 'P'} color={colors.teal} size="lg" />
                <View style={styles.patientGridMeta}>
                  <Text style={styles.patientListNameLarge}>{p.name}</Text>
                  <Text style={styles.patientListConditionLarge}>Age: {p.age} {p.notes ? `| ${p.notes.substring(0,20)}...` : ''}</Text>
                  <View style={styles.patientGridProgressRow}>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[styles.progressBarFill, { width: '0%', backgroundColor: colors.teal }]}
                      />
                    </View>
                    <Text style={styles.progressPctText}>0%</Text>
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

