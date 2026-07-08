import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { ChevronLeft, Bell, CheckCircle, AlertCircle, Clock, Trash2, Check } from 'lucide-react-native';
import { styles as globalStyles } from '../theme/styles';
import { Screen } from '../types';
import { TEAL, TEAL_LIGHT, BG_COLOR } from '../theme/colors';

type Notification = {
  id: string;
  type: 'alert' | 'info' | 'success' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Deviation Detected',
    message: 'Patient Sara M. has exceeded the pain threshold during hip flexion exercise.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Session Reminder',
    message: 'You have a session with John D. scheduled in 30 minutes.',
    time: '28 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Program Completed',
    message: 'Ahmed K. has successfully completed the Knee Rehabilitation program.',
    time: '1h ago',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'New Patient Assigned',
    message: 'Maria L. has been assigned to your care. Review her profile to get started.',
    time: '3h ago',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    title: 'Missed Session',
    message: 'Patient Tom R. missed their scheduled session today at 10:00 AM.',
    time: '5h ago',
    read: true,
  },
  {
    id: '6',
    type: 'success',
    title: 'Report Ready',
    message: 'Monthly progress report for your department is now available.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '7',
    type: 'reminder',
    title: 'Weekly Review',
    message: 'Don\'t forget to review patient progress notes before your team meeting.',
    time: 'Yesterday',
    read: true,
  },
];

const TYPE_CONFIG = {
  alert: { icon: AlertCircle, color: '#FF6B6B', bg: '#FFF1F0' },
  info: { icon: Bell, color: '#4A90D9', bg: '#EBF4FF' },
  success: { icon: CheckCircle, color: '#4CAF50', bg: '#F0FFF4' },
  reminder: { icon: Clock, color: '#F5A623', bg: '#FFF8ED' },
};

export default function NotificationsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('dashboard')}>
          <ChevronLeft size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {unreadCount > 0 ? (
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
              <Check size={13} color={TEAL} />
              <Text style={styles.markAllText}>All read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 72 }} />
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Unread section */}
        {unread.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NEW</Text>
            {unread.map(n => (
              <NotifCard key={n.id} notification={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </View>
        )}

        {/* Read section */}
        {read.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>EARLIER</Text>
            {read.map(n => (
              <NotifCard key={n.id} notification={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </View>
        )}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Bell size={36} color={TEAL} />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No notifications at the moment.</Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function NotifCard({
  notification: n,
  onRead,
  onDismiss,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const { icon: Icon, color, bg } = TYPE_CONFIG[n.type];

  return (
    <TouchableOpacity
      style={[styles.card, n.read && styles.cardRead]}
      activeOpacity={0.7}
      onPress={() => onRead(n.id)}
    >
      {!n.read && <View style={styles.unreadDot} />}
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={[styles.cardTitle, n.read && styles.cardTitleRead]} numberOfLines={1}>
            {n.title}
          </Text>
          <Text style={styles.cardTime}>{n.time}</Text>
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>{n.message}</Text>
      </View>
      <TouchableOpacity style={styles.dismissBtn} onPress={() => onDismiss(n.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Trash2 size={14} color="#CBD5E0" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // safeContainer is from globalStyles (handles Android status bar)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Poppins_700Bold',
    color: '#1A1A2E',
  },
  headerBadge: {
    backgroundColor: TEAL,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 8,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 20,
  },
  markAllText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: TEAL,
    marginLeft: 4,
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
    color: '#8A94A6',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    position: 'relative',
  },
  cardRead: {
    opacity: 0.7,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: TEAL,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A2E',
    flex: 1,
    marginRight: 8,
  },
  cardTitleRead: {
    fontFamily: 'Poppins_500Medium',
    color: '#4A5568',
  },
  cardTime: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#A0AEC0',
    flexShrink: 0,
  },
  cardMessage: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#718096',
    lineHeight: 19,
  },
  dismissBtn: {
    marginLeft: 8,
    padding: 4,
    alignSelf: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#8A94A6',
  },
});
