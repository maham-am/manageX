import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const CourseDetailsScreen = ({ route }) => {
  const { course } = route.params;

  const getGradeColor = (grade) => {
    switch (grade.charAt(0)) {
      case 'A': return colors.success;
      case 'B': return colors.warning;
      case 'C': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderInfoCard = (title, items) => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{item.label}:</Text>
          <Text style={styles.infoValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  const renderAssignmentCard = () => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>Assignments & Grades</Text>
      {course.assignments.map((assignment, index) => (
        <View key={index} style={styles.assignmentItem}>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentName}>{assignment.name}</Text>
            <Text style={styles.assignmentGrade}>
              Grade: <Text style={{ color: getGradeColor(assignment.grade) }}>{assignment.grade}</Text>
            </Text>
          </View>
          <View style={styles.assignmentScore}>
            <Text style={[styles.assignmentPercentage, { color: getGradeColor(assignment.grade) }]}>
              {assignment.percentage}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAttendanceCard = () => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>Attendance Details</Text>
      <View style={styles.attendanceGrid}>
        <View style={styles.attendanceItem}>
          <Text style={[styles.attendanceNumber, { color: colors.success }]}>
            {course.attendance.present}
          </Text>
          <Text style={styles.attendanceLabel}>Present</Text>
        </View>
        <View style={styles.attendanceItem}>
          <Text style={[styles.attendanceNumber, { color: colors.error }]}>
            {course.attendance.total - course.attendance.present}
          </Text>
          <Text style={styles.attendanceLabel}>Absent</Text>
        </View>
        <View style={styles.attendanceItem}>
          <Text style={[styles.attendanceNumber, { color: colors.primary }]}>
            {course.attendance.percentage}%
          </Text>
          <Text style={styles.attendanceLabel}>Overall</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${course.attendance.percentage}%`,
                backgroundColor: course.attendance.percentage >= 80 ? colors.success : 
                                course.attendance.percentage >= 60 ? colors.warning : colors.error
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Attendance Progress</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.header}
      >
        <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Course Details</Text>
        </View>
          
          <Text style={styles.headerSubtitle}>{course.name}</Text>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Course Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                  {course.credits} Credits
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: getGradeColor(course.grade) }]}>
                  {course.grade}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: colors.success }]}>
                  {course.attendance.percentage}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.courseHeader}>
          <View style={styles.courseIcon}>
            <Ionicons name="book" size={32} color={colors.primary} />
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseCode}>{course.code}</Text>
            <Text style={styles.instructor}>Instructor: {course.instructor}</Text>
          </View>
          <View style={styles.gradeContainer}>
            <Text style={[styles.grade, { color: getGradeColor(course.grade) }]}>
              {course.grade}
            </Text>
            <Text style={styles.percentage}>{course.percentage}%</Text>
          </View>
        </View>

        {renderInfoCard('Course Information', [
          { label: 'Description', value: course.description },
          { label: 'Credits', value: course.credits.toString() },
          { label: 'Instructor', value: course.instructor },
        ])}

        {renderAttendanceCard()}
        {renderAssignmentCard()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.lg,
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
  headerTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.base,
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  summaryTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.sm,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.sm,
  },
  courseIcon: {
    marginRight: spacing.md,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  courseCode: {
    fontSize: typography.base,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  instructor: {
    fontSize: typography.sm,
  },
  gradeContainer: {
    alignItems: 'center',
  },
  grade: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
  },
  percentage: {
    fontSize: typography.base,
  },
  infoCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    flex: 1,
  },
  infoValue: {
    fontSize: typography.base,
    flex: 2,
    textAlign: 'right',
  },
  attendanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  attendanceItem: {
    alignItems: 'center',
  },
  attendanceNumber: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  attendanceLabel: {
    fontSize: typography.sm,
    marginTop: spacing.xs,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.sm,
    textAlign: 'center',
  },
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentName: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  assignmentGrade: {
    fontSize: typography.sm,
  },
  assignmentScore: {
    alignItems: 'center',
  },
  assignmentPercentage: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
});

export default CourseDetailsScreen;
