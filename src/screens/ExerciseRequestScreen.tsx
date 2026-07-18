import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, Send, CheckCircle, Clock } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Screen } from '../types';
import { ExerciseRequestService } from '../services/api';

export default function ExerciseRequestScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { styles, colors } = useTheme();
  const [form, setForm] = useState({ name: '', description: '', reference_link: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  const fetchRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const res = await ExerciseRequestService.getMyRequests();
      if (res?.data) setRequests(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'history') {
      fetchRequests();
    }
  }, [activeTab]);

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      Alert.alert('Error', 'Name and description are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await ExerciseRequestService.submitRequest(form);
      Alert.alert('Success', 'Exercise request submitted successfully.');
      setForm({ name: '', description: '', reference_link: '' });
      setActiveTab('history');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return colors.teal;
      case 'rejected': return colors.error;
      default: return colors.warning;
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('more')}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Exercise Requests</Text>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 }}>
        <TouchableOpacity 
          style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: activeTab === 'new' ? colors.teal : 'transparent', alignItems: 'center' }}
          onPress={() => setActiveTab('new')}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold', color: activeTab === 'new' ? colors.teal : colors.textMuted }}>New Request</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: activeTab === 'history' ? colors.teal : 'transparent', alignItems: 'center' }}
          onPress={() => setActiveTab('history')}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold', color: activeTab === 'history' ? colors.teal : colors.textMuted }}>My Requests</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'new' ? (
        <ScrollView style={styles.scrollBody} contentContainerStyle={{ padding: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: colors.text, marginBottom: 8 }}>
              Request Custom Exercise
            </Text>
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: colors.textMuted }}>
              Submit a request for a new exercise to be added to the system by the administration.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text, marginBottom: 8 }}>Exercise Name *</Text>
            <TextInput
              style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 14, color: colors.text, marginTop: 8 }}
              placeholder="e.g. Advanced Leg Press"
              placeholderTextColor={colors.textSecondary}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text, marginBottom: 8 }}>Description *</Text>
            <TextInput
              style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: colors.text, marginTop: 8, height: 100, textAlignVertical: 'top' }}
              placeholder="Describe the exercise mechanics, muscles targeted, etc."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text, marginBottom: 8 }}>Reference Link (Optional)</Text>
            <TextInput
              style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 14, color: colors.text, marginTop: 8 }}
              placeholder="URL to a video or article"
              placeholderTextColor={colors.textSecondary}
              value={form.reference_link}
              autoCapitalize="none"
              keyboardType="url"
              onChangeText={(text) => setForm({ ...form, reference_link: text })}
            />
          </View>

          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.teal, opacity: isSubmitting ? 0.7 : 1 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Send size={18} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.ctaBtnText}>Submit Request</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollBody} contentContainerStyle={{ padding: 20 }}>
          {isLoadingRequests ? (
            <ActivityIndicator size="large" color={colors.teal} style={{ marginTop: 40 }} />
          ) : requests.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40, fontFamily: 'Poppins_500Medium' }}>
              You haven't made any requests yet.
            </Text>
          ) : (
            requests.map(req => (
              <View key={req.id} style={{ backgroundColor: colors.card, borderRadius: 20, marginHorizontal: 20, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text, flex: 1 }}>{req.name}</Text>
                  <View style={{ backgroundColor: getStatusColor(req.status) + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 10, color: getStatusColor(req.status), textTransform: 'uppercase' }}>
                      {req.status}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
                  {req.description}
                </Text>
                
                {req.admin_feedback && (
                  <View style={{ backgroundColor: colors.background, padding: 12, borderRadius: 8, marginTop: 8 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: colors.text, marginBottom: 4 }}>Admin Feedback:</Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.text }}>{req.admin_feedback}</Text>
                  </View>
                )}
                
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.textSecondary, marginTop: 12 }}>
                  Submitted on {new Date(req.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
