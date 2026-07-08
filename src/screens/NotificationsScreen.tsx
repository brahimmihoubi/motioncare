import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { ChevronLeft, Bell, CheckCircle, AlertCircle, Clock, Trash2, Check } from 'lucide-react-native';
import { Screen } from '../types';
import { useTheme } from '../theme/ThemeContext';

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
  const { styles, colors } = useTheme();
  const localStyles = getLocalStyles(colors);
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
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={localStyles.header}>
        <TouchableOpacity style={localStyles.backButton} onPress={() => onNavigate('dashboard')}>
          <ChevronLeft size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={localStyles.headerCenter}>
          <Text style={localStyles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={localStyles.headerBadge}>
              <Text style={localStyles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={localStyles.headerRight}>
          {unreadCount > 0 ? (
            <TouchableOpacity style={localStyles.markAllBtn} onPress={markAllRead}>
              <Check size={13} color={colors.teal} />
              <Text style={localStyles.markAllText}>All read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 72 }} />
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={localStyles.scrollBody}>
        {/* Unread section */}
        {unread.length > 0 && (
          <View style={localStyles.section}>
            <Text style={localStyles.sectionLabel}>NEW</Text>
            {unread.map(n => (
              <NotifCard key={n.id} notification={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </View>
        )}

        {/* Read section */}
        {read.length > 0 && (
          <View style={localStyles.section}>
            <Text style={localStyles.sectionLabel}>EARLIER</Text>
            {read.map(n => (
              <NotifCard key={n.id} notification={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </View>
        )}

        {notifications.length === 0 && (
          <View style={localStyles.emptyState}>
            <View style={localStyles.emptyIcon}>
              <Bell size={36} color={colors.teal} />
            </View>
            <Text style={localStyles.emptyTitle}>All caught up!</Text>
            <Text style={localStyles.emptySubtitle}>No notifications at the moment.</Text>
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
  const { styles, colors } = useTheme();
  const localStyles = getLocalStyles(colors);
  const { icon: Icon, color, bg } = TYPE_CONFIG[n.type];

  return (
    <TouchableOpacity
      style={[localStyles.card, n.read && localStyles.cardRead]}
      activeOpacity={0.7}
      onPress={() => onRead(n.id)}
    >
      {!n.read && <View style={localStyles.unreadDot} />}
      <View style={[localStyles.iconWrap, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={localStyles.cardBody}>
        <View style={localStyles.cardTop}>
          <Text style={[localStyles.cardTitle, n.read && localStyles.cardTitleRead]} numberOfLines={1}>
            {n.title}
          </Text>
          <Text style={localStyles.cardTime}>{n.time}</Text>
        </View>
        <Text style={localStyles.cardMessage} numberOfLines={2}>{n.message}</Text>
      </View>
      <TouchableOpacity style={localStyles.dismissBtn} onPress={() => onDismiss(n.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Trash2 size={14} color="#CBD5E0" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const getLocalStyles = (colors: any) => StyleSheet.create({
  // safeContainer is from globalStyles (handles Android status bar)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.text,
  },
  headerBadge: {
    backgroundColor: colors.teal,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 8,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.tealLight,
    borderRadius: 20,
  },
  markAllText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: colors.teal,
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
    color: colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
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
    backgroundColor: colors.teal,
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
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  cardTitleRead: {
    fontFamily: 'Poppins_500Medium',
    color: colors.textMuted,
  },
  cardTime: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    flexShrink: 0,
  },
  cardMessage: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: colors.textMuted,
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
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
  },
});
