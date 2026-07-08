import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, MotionCareLogo } from '../components';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PatientsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { styles, colors } = useTheme();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");

  const filtered = patients.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase());
    if (tab === "All") return matchesQuery;
    return matchesQuery && p.status === tab;
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.patientsHeaderContainer}>
        <View style={styles.patientsHeaderRow}>
          <Text style={styles.titleText}>Patients</Text>
          <TouchableOpacity style={styles.addBtnContainer}>
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
          {filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => onNavigate("patient-detail")}
              style={styles.patientGridCard}
              activeOpacity={0.7}
            >
              <Avatar initials={p.avatar} color={p.color} size="lg" />
              <View style={styles.patientGridMeta}>
                <Text style={styles.patientListNameLarge}>{p.name}</Text>
                <Text style={styles.patientListConditionLarge}>{p.condition}</Text>
                <View style={styles.patientGridProgressRow}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[styles.progressBarFill, { width: `${p.completed}%` as any, backgroundColor: colors.teal }]}
                    />
                  </View>
                  <Text style={styles.progressPctText}>{p.completed}%</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#CBD5E0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

