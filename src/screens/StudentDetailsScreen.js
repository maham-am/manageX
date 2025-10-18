import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../context/DataContext';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const StudentDetailsScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const { calculateAttendanceStats } = useData();
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuPress = () => {
    setShowMenu(true);
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  const handleEditAttendance = () => {
    setShowMenu(false);
    Alert.alert('Edit Attendance', 'Feature coming soon!');
  };

  const handleViewHistory = () => {
    setShowMenu(false);
    Alert.alert('View History', 'Feature coming soon!');
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Student Details</Text>
              <Text style={styles.headerSubtitle}>Class VIII - B</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
                <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: colors.success }]}>
                  {calculateAttendanceStats(student.id).total}
                </Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: student.gender === 'male' ? colors.male : colors.female }]}>
                  {student.gender === 'male' ? 'M' : 'F'}
                </Text>
                <Text style={styles.summaryLabel}>Gender</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                  {calculateAttendanceStats(student.id).percentage.toFixed(1)}%
                </Text>
                <Text style={styles.summaryLabel}>Attendance</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          {/* Student Profile Section */}
          <View style={styles.studentInfo}>
            <View style={[styles.avatar, { backgroundColor: student.gender === 'male' ? colors.male : colors.female }]}>
              <Text style={styles.avatarText}>
                {student.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.studentDetails}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentId}>ID: {student.id}</Text>
              <View style={styles.bloodGroupContainer}>
                <Text style={styles.bloodGroup}>{student.bloodGroup}</Text>
              </View>
            </View>
          </View>
          
          {/* Attendance Section */}
          <View style={styles.attendanceSection}>
            <View style={styles.attendanceHeader}>
              <Text style={styles.attendanceSectionTitle}>Attendance Summary</Text>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={handleMenuPress}
              >
                <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.attendanceGrid}>
              <View style={styles.attendanceItem}>
                <Text style={[styles.attendanceNumber, { color: colors.success }]}>
                  {calculateAttendanceStats(student.id).present}
                </Text>
                <Text style={styles.attendanceLabel}>Present</Text>
              </View>
              <View style={styles.attendanceItem}>
                <Text style={[styles.attendanceNumber, { color: colors.error }]}>
                  {calculateAttendanceStats(student.id).absent}
                </Text>
                <Text style={styles.attendanceLabel}>Absent</Text>
              </View>
              <View style={styles.attendanceItem}>
                <Text style={[styles.attendanceNumber, { color: colors.warning }]}>
                  {calculateAttendanceStats(student.id).leave}
                </Text>
                <Text style={styles.attendanceLabel}>Leave</Text>
              </View>
              <View style={styles.attendanceItem}>
                <Text style={[styles.attendanceNumber, { color: colors.primary }]}>
                  {calculateAttendanceStats(student.id).percentage.toFixed(1)}%
                </Text>
                <Text style={styles.attendanceLabel}>Overall</Text>
              </View>
            </View>
          </View>

          {/* Personal Information Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoRows}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>D.O.B:</Text>
                <Text style={styles.infoValue}>{new Date(student.dateOfBirth).toLocaleDateString()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Parent:</Text>
                <Text style={styles.infoValue}>{student.parentName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact No:</Text>
                <Text style={styles.infoValue}>{student.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>{student.address}</Text>
              </View>
            </View>
          </View>

          {/* Courses Section */}
          <View style={styles.coursesSection}>
            <Text style={styles.sectionTitle}>Enrolled Courses</Text>
            {student.courses.map((course, index) => (
              <View key={index} style={styles.courseItem}>
                <View style={styles.courseIcon}>
                  <Ionicons name="book" size={16} color={colors.primary} />
                </View>
                <Text style={styles.courseName}>{course}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={handleMenuClose}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleMenuClose}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleEditAttendance}
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Edit Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleViewHistory}
            >
              <Ionicons name="time" size={20} color={colors.warning} />
              <Text style={[styles.menuItemText, { color: colors.warning }]}>View History</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
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
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  summaryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  summaryLabel: {
    fontSize: typography.xs,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  mainCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.sm,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  attendanceSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  attendanceSectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
  },
  infoSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  coursesSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  infoRows: {
    // Container for info rows
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  studentName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  studentId: {
    fontSize: typography.base,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  bloodGroupContainer: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  bloodGroup: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  menuButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  infoValue: {
    fontSize: typography.base,
    flex: 1,
    textAlign: 'right',
  },
  attendanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  attendanceItem: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    minWidth: '20%',
  },
  attendanceNumber: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  attendanceLabel: {
    fontSize: typography.sm,
    marginTop: spacing.xs,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  courseIcon: {
    marginRight: spacing.sm,
  },
  courseName: {
    fontSize: typography.base,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    minWidth: 180,
    ...shadows.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  menuItemText: {
    fontSize: typography.base,
    marginLeft: spacing.sm,
    fontWeight: typography.medium,
  },
});

export default StudentDetailsScreen;
