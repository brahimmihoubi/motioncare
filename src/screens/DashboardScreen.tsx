import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, Activity } from 'lucide-react-native';
import { Screen } from '../types';
import { Avatar, MotionCareLogo, ShimmerPlaceholder } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';
import { socketService } from '../services/socket';

export default function DashboardScreen({
  onNavigate,
  onLogout,
}: {
  onNavigate: (s: Screen) => void;
  onLogout?: () => void;
}) {
  const { styles, colors } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [statsData, patientsData] = await Promise.all([
        DataService.getDashboardStats(),
        DataService.getPatients()
      ]);
      setStats(statsData.data);
      setRecentPatients(Array.isArray(patientsData.data) ? patientsData.data : []);
    } catch (err: any) {
      console.error("Failed to load dashboard data", err);
      // If auth failed (401) and the interceptor's refresh also failed,
      // fall back to logout so the user is sent to login instead of stuck.
      if (err?.response?.status === 401 && onLogout) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleUpdate = () => {
      console.log('[Mobile] Real-time update received! Refreshing dashboard...');
      loadData();
    };

    const events = [
      'patient:created', 'patient:updated', 'patient:deleted',
      'session:created', 'session:updated', 'session:deleted'
    ];

    events.forEach(event => socketService.on(event, handleUpdate));

    return () => {
      events.forEach(event => socketService.off(event, handleUpdate));
    };
  }, []);
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.appHeader}>
        <View style={styles.headerProfile}>
          <MotionCareLogo size={38} withBg={false} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.headerProfileGreet}>Good Morning 👋</Text>
            <Text style={styles.headerProfileName}>Dr. Sara Ahmed</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerActionBtn} onPress={() => onNavigate('notifications')} activeOpacity={0.7}>
          <Bell size={18} color={colors.teal} />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Stats Card */}
        <View style={styles.dashboardStatsCard}>
          <View style={styles.statsCardGrid}>
            <View style={styles.statsCardCol}>
              <Text style={styles.statsCardLabel}>Total Patients</Text>
              {isLoading ? (
                <ShimmerPlaceholder style={{ width: 40, height: 32, borderRadius: 4, marginVertical: 4 }} />
              ) : (
                <Text style={styles.statsCardVal}>{stats?.totalPatients || 0}</Text>
              )}
              <Text style={styles.statsCardSub}>Active base</Text>
            </View>
            <View style={styles.dividerVal} />
            <View style={styles.statsCardCol}>
              <Text style={styles.statsCardLabel}>Sessions</Text>
              {isLoading ? (
                <ShimmerPlaceholder style={{ width: 40, height: 32, borderRadius: 4, marginVertical: 4 }} />
              ) : (
                <Text style={styles.statsCardVal}>{stats?.totalSessions || 0}</Text>
              )}
              <Text style={styles.statsCardSub}>{stats?.complianceRate || '0%'} compl.</Text>
            </View>
            <View style={styles.starCircle}>
              <Activity size={20} color={colors.teal} />
            </View>
          </View>
        </View>

        {/* Schedule Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <TouchableOpacity onPress={() => onNavigate("patients")}>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Patients mini list */}
        <View style={styles.dashboardList}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <View key={`shimmer-${index}`} style={styles.patientListItem}>
                <ShimmerPlaceholder style={{ width: 40, height: 40, borderRadius: 20 }} />
                <View style={[styles.patientListMeta, { justifyContent: 'center' }]}>
                  <ShimmerPlaceholder style={{ width: 120, height: 16, borderRadius: 4, marginBottom: 8 }} />
                  <ShimmerPlaceholder style={{ width: 80, height: 12, borderRadius: 4 }} />
                </View>
                <View style={styles.patientListEnd}>
                  <ShimmerPlaceholder style={{ width: 50, height: 24, borderRadius: 12, marginBottom: 4 }} />
                  <ShimmerPlaceholder style={{ width: 40, height: 12, borderRadius: 4 }} />
                </View>
              </View>
            ))
          ) : (
            <>
              {recentPatients.slice(0, 4).map((p: any) => (
                <TouchableOpacity
                  key={p._id || p.id}
                  onPress={() => onNavigate("patient-detail")}
                  style={styles.patientListItem}
                  activeOpacity={0.7}
                >
                  <Avatar initials={p.name?.substring(0, 2).toUpperCase() || 'P'} color={colors.teal} size="md" />
                  <View style={styles.patientListMeta}>
                    <Text style={styles.patientListName}>{p.name}</Text>
                    <Text style={styles.patientListCondition} numberOfLines={1}>
                      {p.condition || 'General'}
                    </Text>
                  </View>
                  <View style={styles.patientListEnd}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: p.status === "Active" ? colors.tealLight : "#F0FFF4",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: p.status === "Active" ? colors.teal : "#4CAF50" },
                        ]}
                      >
                        {p.status || 'Active'}
                      </Text>
                    </View>
                    <Text style={styles.patientListTime}>
                      {p.lastSessionDate ? new Date(p.lastSessionDate).toLocaleDateString() : 'New'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {recentPatients.length === 0 && (
                <Text style={{ textAlign: 'center', color: '#718096', padding: 20 }}>No patients found.</Text>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onNavigate("patients")}
          style={[styles.ctaBtn, { marginVertical: 20, backgroundColor: colors.teal }]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>View All Patients</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

