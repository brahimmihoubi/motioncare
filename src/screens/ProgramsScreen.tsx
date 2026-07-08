import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { TEAL, TEAL_DARK, TEAL_LIGHT, BG_COLOR } from '../theme/colors';
import { styles } from '../theme/styles';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, MotionCareLogo } from '../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProgramsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <Text style={[styles.titleText, { flex: 1, paddingLeft: 10 }]}>Programs</Text>
        <TouchableOpacity style={styles.addBtnContainer}>
          <Plus size={18} color={TEAL} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Sub-tabs */}
        <View style={styles.tabsRow}>
          {["Active", "Completed", "Draft"].map((t, idx) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, idx === 0 && { backgroundColor: TEAL }]}
            >
              <Text style={[styles.tabBtnText, { color: idx === 0 ? "white" : "#8A94A6" }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Programs List */}
        <View style={styles.dashboardList}>
          {programs.map((prog) => (
            <TouchableOpacity
              key={prog.id}
              onPress={() => onNavigate("edit-program")}
              style={styles.programItemCard}
              activeOpacity={0.7}
            >
              <View style={[styles.programIconBox, { backgroundColor: prog.color }]}>
                <Text style={{ fontSize: 22 }}>{prog.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.programNameText}>{prog.name}</Text>
                <Text style={styles.programPatientText}>Patient: {prog.patient}</Text>
                <View style={styles.programDetailsRow}>
                  <View style={styles.programMetaInline}>
                    <Activity size={12} color={TEAL} />
                    <Text style={styles.programMetaText}>{prog.exercises} exercises</Text>
                  </View>
                  <View style={[styles.programMetaInline, { marginLeft: 15 }]}>
                    <Clock size={12} color={TEAL} />
                    <Text style={styles.programMetaText}>{prog.weeks} weeks</Text>
                  </View>
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

