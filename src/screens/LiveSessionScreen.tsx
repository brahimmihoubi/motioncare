import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { ChevronLeft, Play, Pause, Square, AlertOctagon, Activity, Battery, Thermometer, Zap } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Screen } from '../types';
import { ExoskeletonService, DataService } from '../services/api';
import { socketService } from '../services/socket';

export default function LiveSessionScreen({ onNavigate, sessionId }: { onNavigate: (s: Screen) => void, sessionId?: number }) {
  const { styles, colors } = useTheme();
  const [session, setSession] = useState<any>(null);
  const [exoState, setExoState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      Alert.alert('Error', 'No session ID provided');
      onNavigate('more');
      return;
    }

    const loadData = async () => {
      try {
        const [sessionRes, exoRes] = await Promise.all([
          DataService.getSessionById(sessionId),
          ExoskeletonService.getSessionState(sessionId)
        ]);
        setSession(sessionRes?.data);
        setExoState(exoRes?.data?.state || {});
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to load live session');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Socket listeners
    socketService.emit('join_session', sessionId);
    
    const handleExoUpdate = (data: any) => {
      setExoState(data);
    };
    const handleSessionUpdate = (data: any) => {
      if (data.id === sessionId) {
        setSession((prev: any) => ({ ...prev, ...data }));
      }
    };

    socketService.on('exo:update', handleExoUpdate);
    socketService.on('session:updated', handleSessionUpdate);

    return () => {
      socketService.emit('leave_session', sessionId);
      socketService.off('exo:update', handleExoUpdate);
      socketService.off('session:updated', handleSessionUpdate);
    };
  }, [sessionId]);

  const handleControl = async (action: 'start' | 'pause' | 'resume' | 'stop' | 'emergency') => {
    if (!sessionId) return;
    try {
      if (action === 'start') await ExoskeletonService.startCountdown(sessionId);
      if (action === 'pause') await ExoskeletonService.pauseSession(sessionId);
      if (action === 'resume') await ExoskeletonService.resumeSession(sessionId);
      if (action === 'stop') await ExoskeletonService.stopSession(sessionId);
      if (action === 'emergency') await ExoskeletonService.emergencyStop(sessionId);
    } catch (e: any) {
      Alert.alert('Control Error', e?.response?.data?.message || 'Action failed');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      </SafeAreaView>
    );
  }

  const statusColors: any = {
    pending: colors.warning,
    countdown: colors.tealDark,
    running: colors.tealDark,
    paused: colors.warning,
    stopped: colors.textSecondary,
    emergency_stop: colors.error,
    completed: colors.teal
  };
  const currentStatus = session?.status || 'pending';
  const statusColor = statusColors[currentStatus] || colors.textSecondary;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('session-history')}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Live Control</Text>
      </View>

      <ScrollView style={styles.scrollBody} contentContainerStyle={{ padding: 20 }}>
        {/* Header Info */}
        <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: colors.text }}>
              {session?.patientName}
            </Text>
            <View style={{ backgroundColor: statusColor + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 12, color: statusColor, textTransform: 'uppercase' }}>
                {currentStatus}
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textMuted }}>
            {session?.programName}
          </Text>
        </View>

        {/* Telemetry Grid */}
        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text, marginBottom: 12 }}>
          Telemetry Data
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
          {/* Battery */}
          <View style={{ width: '48%', backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Battery size={16} color={colors.teal} />
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textMuted, marginLeft: 6 }}>Battery</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: colors.text }}>
              {exoState?.batteryLevel || 0}%
            </Text>
          </View>
          {/* Temperature */}
          <View style={{ width: '48%', backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Thermometer size={16} color={colors.warning} />
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textMuted, marginLeft: 6 }}>Motor Temp</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: colors.text }}>
              {exoState?.motorTemp || 0}°C
            </Text>
          </View>
          {/* Joint Angle */}
          <View style={{ width: '48%', backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Activity size={16} color={colors.tealDark} />
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textMuted, marginLeft: 6 }}>Joint Angle</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: colors.text }}>
              {exoState?.jointAngle || 0}°
            </Text>
          </View>
          {/* Velocity */}
          <View style={{ width: '48%', backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Zap size={16} color={colors.tealDark} />
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textMuted, marginLeft: 6 }}>Velocity</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: colors.text }}>
              {exoState?.velocity || 0} m/s
            </Text>
          </View>
        </View>

        {/* Status Messages */}
        {currentStatus === 'countdown' && (
          <View style={{ alignItems: 'center', marginBottom: 24, padding: 20, backgroundColor: colors.tealDark + '10', borderRadius: 16 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 48, color: colors.tealDark }}>
              {session?.countdown || 5}
            </Text>
            <Text style={{ fontFamily: 'Poppins_500Medium', color: colors.tealDark }}>Starting in...</Text>
          </View>
        )}

        {currentStatus === 'running' && (
          <View style={{ alignItems: 'center', marginBottom: 24, padding: 20, backgroundColor: colors.tealDark + '10', borderRadius: 16 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 36, color: colors.tealDark }}>
              {session?.elapsedTime || 0}s
            </Text>
            <Text style={{ fontFamily: 'Poppins_500Medium', color: colors.tealDark }}>Active Session Time</Text>
          </View>
        )}

        {/* Controls */}
        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text, marginBottom: 12 }}>
          Exoskeleton Control
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
          {currentStatus === 'pending' && (
            <TouchableOpacity 
              style={[localStyles.controlBtn, { backgroundColor: colors.teal }]} 
              onPress={() => handleControl('start')}
            >
              <Play size={24} color="white" />
              <Text style={localStyles.controlText}>Start</Text>
            </TouchableOpacity>
          )}

          {currentStatus === 'running' && (
            <TouchableOpacity 
              style={[localStyles.controlBtn, { backgroundColor: colors.warning }]} 
              onPress={() => handleControl('pause')}
            >
              <Pause size={24} color="white" />
              <Text style={localStyles.controlText}>Pause</Text>
            </TouchableOpacity>
          )}

          {currentStatus === 'paused' && (
            <TouchableOpacity 
              style={[localStyles.controlBtn, { backgroundColor: colors.tealDark }]} 
              onPress={() => handleControl('resume')}
            >
              <Play size={24} color="white" />
              <Text style={localStyles.controlText}>Resume</Text>
            </TouchableOpacity>
          )}

          {(currentStatus === 'running' || currentStatus === 'paused' || currentStatus === 'countdown') && (
            <TouchableOpacity 
              style={[localStyles.controlBtn, { backgroundColor: colors.textMuted }]} 
              onPress={() => handleControl('stop')}
            >
              <Square size={24} color="white" />
              <Text style={localStyles.controlText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>

        {(currentStatus === 'running' || currentStatus === 'paused' || currentStatus === 'countdown') && (
          <TouchableOpacity 
            style={[localStyles.emergencyBtn, { backgroundColor: colors.error }]}
            onPress={() => {
              Alert.alert('Emergency Stop', 'Are you sure you want to trigger an EMERGENCY STOP?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'EMERGENCY STOP', style: 'destructive', onPress: () => handleControl('emergency') }
              ]);
            }}
          >
            <AlertOctagon size={28} color="white" />
            <Text style={localStyles.emergencyText}>EMERGENCY STOP</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  controlBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  controlText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    marginTop: 4
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  emergencyText: {
    color: 'white',
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 18,
    marginLeft: 12
  }
});
