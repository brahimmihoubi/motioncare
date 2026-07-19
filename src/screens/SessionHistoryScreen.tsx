import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { ChevronLeft, Calendar, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Screen } from '../types';
import { DataService } from '../services/api';

export default function SessionHistoryScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const { styles, colors } = useTheme();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await DataService.getRecentSessions(50);
      if (res?.data) {
        setSessions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchSessions();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.teal;
      case 'missed': return colors.error;
      case 'running': return colors.tealDark;
      case 'pending': return colors.warning;
      default: return colors.textMuted;
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('more')}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Session History</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollBody}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
        >
          {sessions.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontFamily: 'Poppins_500Medium' }}>No sessions found.</Text>
            </View>
          ) : (
            sessions.map((s) => (
              <View key={s.id} style={{ backgroundColor: colors.card, borderRadius: 20, marginHorizontal: 20, marginBottom: 12, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: getStatusColor(s.status) + '20', justifyContent: 'center', alignItems: 'center' }}>
                  {s.status === 'completed' ? <CheckCircle size={20} color={getStatusColor(s.status)} /> : 
                   s.status === 'missed' ? <AlertTriangle size={20} color={getStatusColor(s.status)} /> : 
                   <Clock size={20} color={getStatusColor(s.status)} />}
                </View>
                
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text }}>
                    {s.patientName || 'Unknown Patient'}
                  </Text>
                  <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: colors.textMuted }}>
                    {s.programName || 'Unknown Program'}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
                    <Calendar size={12} color={colors.textSecondary} />
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: colors.textSecondary, marginLeft: 4 }}>
                      {new Date(s.date).toLocaleDateString()}
                    </Text>
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.border, marginHorizontal: 8 }} />
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: colors.textSecondary, marginLeft: 4 }}>
                      {s.duration} min
                    </Text>
                  </View>
                </View>

                {/* If session is active/pending, show a button to go to live control */}
                {['pending', 'countdown', 'running', 'paused'].includes(s.status) && (
                  <TouchableOpacity
                    onPress={() => onNavigate('live-session', { sessionId: s.id })}
                    style={{ padding: 8, backgroundColor: colors.teal + '20', borderRadius: 8 }}
                  >
                    <Activity size={20} color={colors.teal} />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
