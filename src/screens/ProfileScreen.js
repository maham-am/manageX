import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useData } from "../context/DataContext";
import ProfileForm from "../components/ProfileForm";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../styles/theme";

const ProfileScreen = () => {
  const {
    students,
    calculateAttendanceStats,
    calculateAcademicPerformance,
    updateStudent,
  } = useData();
  // Prefer showing student with id '25' (Maha Maryam) on the profile screen
  const currentStudent =
    (students || []).find((s) => String(s.id) === "25") ||
    (students && students.length > 0 ? students[0] : null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const handleEditProfile = useCallback(() => {
    setShowEditForm(true);
  }, []);

  const handleSaveProfile = useCallback(
    (profileData) => {
      if (!currentStudent) return;
      updateStudent({ ...profileData, id: currentStudent.id });
      setShowEditForm(false);
    },
    [updateStudent]
  );

  const handleCancelEdit = useCallback(() => {
    setShowEditForm(false);
  }, []);

  const renderProfileHeader = useCallback(
    () => (
      <View
        style={[
          styles.profileHeader,
          { backgroundColor: colors.white, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {currentStudent.profileImage ? (
              <Image
                source={{ uri: currentStudent.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <LinearGradient
                colors={
                  currentStudent.gender === "male"
                    ? [colors.male, colors.secondary]
                    : [colors.female, "#F472B6"]
                }
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {currentStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </LinearGradient>
            )}
            <TouchableOpacity
              style={[
                styles.editAvatarButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.studentName, { color: colors.textPrimary }]}>
              {currentStudent.name}
            </Text>
            <Text style={[styles.studentId, { color: colors.primary }]}>
              ID: {currentStudent.id}
            </Text>

            <View style={styles.profileMeta}>
              <View
                style={[
                  styles.bloodGroupContainer,
                  {
                    backgroundColor:
                      currentStudent.gender === "male"
                        ? colors.male
                        : colors.female,
                  },
                ]}
              >
                <Text style={styles.bloodGroup}>
                  {currentStudent.bloodGroup}
                </Text>
              </View>
              <View
                style={[
                  styles.genderContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <Ionicons
                  name={currentStudent.gender === "male" ? "male" : "female"}
                  size={16}
                  color={
                    currentStudent.gender === "male"
                      ? colors.male
                      : colors.female
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    {
                      color:
                        currentStudent.gender === "male"
                          ? colors.male
                          : colors.female,
                    },
                  ]}
                >
                  {currentStudent.gender.charAt(0).toUpperCase() +
                    currentStudent.gender.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil" size={16} color={colors.white} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    ),
    [currentStudent, handleEditProfile, colors]
  );

  const renderInfoCard = useCallback(
    (title, items) => (
      <View
        style={[
          styles.infoCard,
          { backgroundColor: colors.white, borderColor: colors.lightGray },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {items.map((item, index) => (
          <View
            key={index}
            style={[styles.infoRow, { borderBottomColor: colors.lightGray }]}
          >
            <View style={styles.infoIcon}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    ),
    [colors]
  );

  const renderStatsCard = useCallback(() => {
    const attendanceStats = calculateAttendanceStats(currentStudent.id);
    const academicPerformance = calculateAcademicPerformance(currentStudent.id);

    return (
      <View
        style={[
          styles.statsCard,
          { backgroundColor: colors.white, borderColor: colors.lightGray },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          Academic Statistics
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View
              style={[styles.statIcon, { backgroundColor: colors.success }]}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.white}
              />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {attendanceStats.percentage.toFixed(1)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Attendance
            </Text>
          </View>
          <View style={styles.statItem}>
            <View
              style={[styles.statIcon, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="book" size={24} color={colors.white} />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {(currentStudent.courses || []).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Courses
            </Text>
          </View>
          <View style={styles.statItem}>
            <View
              style={[styles.statIcon, { backgroundColor: colors.warning }]}
            >
              <Ionicons name="trophy" size={24} color={colors.white} />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {academicPerformance.grade}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Overall Grade
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.info }]}>
              <Ionicons name="trending-up" size={24} color={colors.white} />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {academicPerformance.overallScore.toFixed(1)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Performance
            </Text>
          </View>
        </View>
      </View>
    );
  }, [
    currentStudent,
    colors,
    calculateAttendanceStats,
    calculateAcademicPerformance,
  ]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notificationButton}
                activeOpacity={0.7}
                onPress={() => setShowSearchModal(true)}
              >
                <Ionicons name="search" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    ),
    [colors]
  );

  // Search/filter logic for modal
  const filteredStudents = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return students || [];
    return (students || []).filter((s) => {
      return (
        String(s.id).toLowerCase().includes(q) ||
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
      );
    });
  }, [searchQuery, students]);

  const closeSearch = useCallback(() => {
    setShowSearchModal(false);
    setSearchQuery("");
  }, []);

  const handleSelectStudent = useCallback(
    (student) => {
      closeSearch();
      navigation.navigate("StudentDetails", { studentId: student.id });
    },
    [navigation, closeSearch]
  );

  if (showEditForm) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileForm
          student={currentStudent}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      </SafeAreaView>
    );
  }
  // If no current student is available yet, render a safe placeholder
  if (!currentStudent) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        {renderHeader()}
        <View
          style={[
            styles.content,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: colors.textSecondary }}>
            No student data available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderStatsCard()}
        {renderInfoCard("Personal Information", [
          { icon: "mail", label: "Email", value: currentStudent.email },
          { icon: "call", label: "Phone", value: currentStudent.phone },
          { icon: "location", label: "Address", value: currentStudent.address },
          {
            icon: "calendar",
            label: "Date of Birth",
            value: new Date(currentStudent.dateOfBirth).toLocaleDateString(),
          },
        ])}
        {renderInfoCard("Emergency Contact", [
          {
            icon: "person",
            label: "Parent/Guardian",
            value: currentStudent.parentName,
          },
          {
            icon: "call",
            label: "Contact Number",
            value: currentStudent.parentContact,
          },
        ])}
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent
        onRequestClose={closeSearch}
      >
        <Pressable style={styles.modalOverlay} onPress={closeSearch}>
          <View style={styles.searchModalContainer}>
            <View style={styles.searchHeader}>
              <TextInput
                placeholder="Search students by name, id or email"
                placeholderTextColor={colors.textSecondary}
                style={styles.searchInputModal}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={closeSearch}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultRow}
                  onPress={() => handleSelectStudent(item)}
                >
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultMeta}>ID: {item.id}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No students found.</Text>
                </View>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  profileHeader: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginVertical: spacing.md,
    ...shadows.md,
    borderWidth: 1,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
    borderWidth: 3,
  },
  profileInfo: {
    alignItems: "center",
  },
  studentName: {
    fontSize: typography["3xl"],
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  studentId: {
    fontSize: typography.lg,
    fontWeight: typography.medium,
    marginBottom: spacing.md,
  },
  profileMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  bloodGroupContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  bloodGroup: {
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  genderText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  editButtonText: {
    marginLeft: spacing.sm,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  avatarText: {
    fontSize: typography["3xl"],
    fontWeight: typography.bold,
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: "48%",
    marginBottom: spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sm,
  },
  infoCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  infoIcon: {
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.sm,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  searchModalContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "60%",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  searchInputModal: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },
  closeButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
  },
  resultRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  resultName: {
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  resultMeta: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  emptyContainer: {
    padding: spacing.md,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textSecondary,
  },
});

ProfileScreen.displayName = "ProfileScreen";

export default ProfileScreen;
