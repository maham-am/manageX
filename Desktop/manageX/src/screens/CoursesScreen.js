import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../context/DataContext';
import CourseForm from '../components/CourseForm';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const CoursesScreen = ({ navigation }) => {
  const { courses, addCourse, updateCourse, deleteCourse } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const getGradeColor = (grade) => {
    switch (grade.charAt(0)) {
      case 'A': return colors.success;
      case 'B': return colors.warning;
      case 'C': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDeleteCourse = (courseId) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCourse(courseId) }
      ]
    );
  };

  const handleSaveCourse = (courseData) => {
    if (editingCourse) {
      updateCourse({ ...courseData, id: editingCourse.id });
    } else {
      addCourse(courseData);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleMenuPress = (course) => {
    setSelectedCourse(course);
    setShowMenu(true);
  };

  const handleMenuClose = () => {
    setShowMenu(false);
    setSelectedCourse(null);
  };

  const handleEditFromMenu = () => {
    setShowMenu(false);
    handleEditCourse(selectedCourse);
  };

  const handleDeleteFromMenu = () => {
    setShowMenu(false);
    handleDeleteCourse(selectedCourse.id);
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetails', { course: item })}
      activeOpacity={0.7}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseName}>{item.name}</Text>
          <Text style={styles.courseCode}>{item.code}</Text>
          <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
        </View>
        
        <View style={styles.gradeContainer}>
          <Text style={[styles.grade, { color: getGradeColor(item.grade) }]}>
            {item.grade}
          </Text>
          <Text style={styles.percentage}>{item.percentage}%</Text>
        </View>
      </View>
      
      <View style={styles.courseStats}>
        <View style={styles.statItem}>
          <Ionicons name="book" size={16} color={colors.primary} />
          <Text style={styles.statText}>{item.credits} Credits</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.statText}>{item.attendance.percentage}% Attendance</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${item.percentage}%`,
                backgroundColor: getGradeColor(item.grade)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Overall Progress</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => handleMenuPress(item)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Courses</Text>
            <Text style={styles.headerSubtitle}>Academic Year 2024-25</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
              <Ionicons name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.success }]}>
                {courses.length}
              </Text>
              <Text style={styles.summaryLabel}>Courses</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Credits</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.warning }]}>
                {(courses.reduce((sum, course) => sum + course.percentage, 0) / courses.length).toFixed(1)}%
              </Text>
              <Text style={styles.summaryLabel}>Average</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (showForm) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CourseForm
          course={editingCourse}
          onSave={handleSaveCourse}
          onCancel={handleCancelForm}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      
      <View style={styles.content}>
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

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
              onPress={handleEditFromMenu}
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDeleteFromMenu}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
              <Text style={[styles.menuItemText, { color: colors.error }]}>Delete</Text>
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
  listContainer: {
    paddingVertical: spacing.md,
  },
  courseCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
  },
  courseCode: {
    fontSize: typography.sm,
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
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
  },
  percentage: {
    fontSize: typography.sm,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: typography.sm,
    marginLeft: spacing.xs,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 8,
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
    fontSize: typography.xs,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  menuButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
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
    minWidth: 150,
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

export default CoursesScreen;
