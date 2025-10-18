import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import StudentsScreen from "./src/screens/StudentsScreen";
import StudentDetailsScreen from "./src/screens/StudentDetailsScreen";
import CoursesScreen from "./src/screens/CoursesScreen";
import CourseDetailsScreen from "./src/screens/CourseDetailsScreen";
import AttendanceScreen from "./src/screens/AttendanceScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

// Import context
import { DataProvider } from "./src/context/DataContext";

// Import theme
import { colors } from "./src/styles/theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Students
function StudentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="StudentsList"
        component={StudentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDetails"
        component={StudentDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Courses
function CoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="CoursesList"
        component={CoursesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={{ title: "Course Details" }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Students") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Courses") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Attendance") {
            iconName = focused
              ? "checkmark-circle"
              : "checkmark-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lightGray,
          paddingBottom: insets.bottom ? insets.bottom + 8 : 12,
          paddingTop: 5,
          height: 60 + (insets.bottom || 0),
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Students" component={StudentsStack} />
      <Tab.Screen name="Courses" component={CoursesStack} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.white}
          translucent={false}
        />
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </DataProvider>
    </SafeAreaProvider>
  );
}
