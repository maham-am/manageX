import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../styles/theme";

const StudentForm = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    address: student?.address || "",
    dateOfBirth: student?.dateOfBirth || "",
    bloodGroup: student?.bloodGroup || "",
    gender: student?.gender || "male",
    parentName: student?.parentName || "",
    parentContact: student?.parentContact || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter student name");
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter email");
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }

    const payload = { ...formData, id: student?.id };
    onSave(payload);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {student ? "Edit Student" : "Add New Student"}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="Enter student name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(value) => handleInputChange("address", value)}
            placeholder="Enter address"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={formData.dateOfBirth}
            onChangeText={(value) => handleInputChange("dateOfBirth", value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Blood Group</Text>
          <TextInput
            style={styles.input}
            value={formData.bloodGroup}
            onChangeText={(value) => handleInputChange("bloodGroup", value)}
            placeholder="e.g., A+ve, B+ve"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.gender === "male" && styles.radioButtonActive,
              ]}
              onPress={() => handleInputChange("gender", "male")}
            >
              <Text
                style={[
                  styles.radioText,
                  formData.gender === "male" && styles.radioTextActive,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.gender === "female" && styles.radioButtonActive,
              ]}
              onPress={() => handleInputChange("gender", "female")}
            >
              <Text
                style={[
                  styles.radioText,
                  formData.gender === "female" && styles.radioTextActive,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Parent/Guardian Name</Text>
          <TextInput
            style={styles.input}
            value={formData.parentName}
            onChangeText={(value) => handleInputChange("parentName", value)}
            placeholder="Enter parent/guardian name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Parent Contact</Text>
          <TextInput
            style={styles.input}
            value={formData.parentContact}
            onChangeText={(value) => handleInputChange("parentContact", value)}
            placeholder="Enter parent contact number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography["2xl"],
    fontWeight: typography.bold,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.base,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  radioGroup: {
    flexDirection: "row",
  },
  radioButton: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    alignItems: "center",
  },
  radioButtonActive: {
    borderColor: colors.primary,
  },
  radioText: {
    fontSize: typography.base,
  },
  radioTextActive: {},
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  saveButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
});

export default StudentForm;
