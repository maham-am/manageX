import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../context/DataContext';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const AttendanceScreen = React.memo(() => {
  const { students, attendanceData, addAttendance, updateAttendance, deleteAttendance, calculateAttendanceStats } = useData();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Morning');
  const [selectedStudent, setSelectedStudent] = useState(students[0]);

  const timeSlots = useMemo(() => ['Morning', 'Afternoon', 'Evening'], []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'present': return colors.success;
      case 'absent': return colors.error;
      case 'leave': return colors.warning;
      default: return colors.textSecondary;
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'present': return 'checkmark-circle';
      case 'absent': return 'close-circle';
      case 'leave': return 'calendar';
      default: return 'help-circle';
    }
  }, []);

  const renderTimeSlotSelector = useCallback(() => (
    <View style={styles.timeSlotContainer}>
      <Text style={styles.sectionTitle}>Time Slot</Text>
      <View style={styles.timeSlotButtons}>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.timeSlotButton,
              selectedTimeSlot === slot && styles.timeSlotButtonActive
            ]}
            onPress={() => setSelectedTimeSlot(slot)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.timeSlotButtonText,
              selectedTimeSlot === slot && styles.timeSlotButtonTextActive
            ]}>
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addTimeSlotButton} activeOpacity={0.7}>
          <Ionicons name="add" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  ), [timeSlots, selectedTimeSlot]);

  const renderAttendanceSummary = () => {
    const attendanceStats = calculateAttendanceStats(selectedStudent.id);
    
    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Attendance Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.success }]}>
              {attendanceStats.present}
            </Text>
            <Text style={styles.summaryLabel}>Present</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.error }]}>
              {attendanceStats.absent}
            </Text>
            <Text style={styles.summaryLabel}>Absent</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.warning }]}>
              {attendanceStats.leave}
            </Text>
            <Text style={styles.summaryLabel}>Leave</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>
              {attendanceStats.percentage.toFixed(1)}%
            </Text>
            <Text style={styles.summaryLabel}>Overall</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProgressBar = () => {
    const attendanceStats = calculateAttendanceStats(selectedStudent.id);
    
    return (
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Attendance Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${attendanceStats.percentage}%`,
                  backgroundColor: attendanceStats.percentage >= 80 ? colors.success : 
                                  attendanceStats.percentage >= 60 ? colors.warning : colors.error
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {attendanceStats.percentage.toFixed(1)}% ({attendanceStats.present}/{attendanceStats.total} days)
          </Text>
        </View>
        
        <View style={styles.progressLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Present ({attendanceStats.present})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
            <Text style={styles.legendText}>Absent ({attendanceStats.absent})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Leave ({attendanceStats.leave})</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAttendanceHistory = () => {
    const studentAttendance = attendanceData.filter(record => record.studentId === selectedStudent.id);
    
    return (
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Recent Attendance</Text>
        {studentAttendance.slice(0, 10).map((record, index) => (
          <View key={record.id} style={styles.historyItem}>
            <View style={styles.historyInfo}>
              <Text style={styles.historyDate}>
                {new Date(record.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
              <Text style={styles.historyCourse}>{record.course}</Text>
              <Text style={styles.historyTime}>{record.time}</Text>
            </View>
            <View style={styles.historyStatus}>
              <Ionicons 
                name={getStatusIcon(record.status)} 
                size={24} 
                color={getStatusColor(record.status)} 
              />
              <Text style={[styles.historyStatusText, { color: getStatusColor(record.status) }]}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Attendance</Text>
            <Text style={styles.headerSubtitle}>Class VIII - B</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => {
                Alert.alert('Add Attendance', 'Feature coming soon!');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTimeSlotSelector()}
        {renderAttendanceSummary()}
        {renderProgressBar()}
        {renderAttendanceHistory()}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerContent: {
    paddingHorizontal: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notificationButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  addButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  dateCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  dateText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  timeSlotContainer: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.sm,
  },
  timeSlotButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSlotButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  timeSlotButtonActive: {
  },
  timeSlotButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  timeSlotButtonTextActive: {
  },
  addTimeSlotButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  summaryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  summaryTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  summaryLabel: {
    fontSize: typography.sm,
    marginTop: spacing.xs,
  },
  progressCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  progressTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 16,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.sm,
    textAlign: 'center',
  },
  progressLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.xs,
  },
  historyCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  historyTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  historyCourse: {
    fontSize: typography.sm,
    marginTop: spacing.xs,
  },
  historyTime: {
    fontSize: typography.xs,
    marginTop: spacing.xs,
  },
  historyStatus: {
    alignItems: 'center',
  },
  historyStatusText: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    marginTop: spacing.xs,
  },
});

AttendanceScreen.displayName = 'AttendanceScreen';

export default AttendanceScreen;
