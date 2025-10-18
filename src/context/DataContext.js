import React, { createContext, useContext, useReducer } from "react";
import {
  students as initialStudents,
  courses as initialCourses,
  attendanceData as initialAttendanceData,
} from "../data/mockData";

const DataContext = createContext();

// Action types
const ActionTypes = {
  // Student actions
  ADD_STUDENT: "ADD_STUDENT",
  UPDATE_STUDENT: "UPDATE_STUDENT",
  DELETE_STUDENT: "DELETE_STUDENT",

  // Course actions
  ADD_COURSE: "ADD_COURSE",
  UPDATE_COURSE: "UPDATE_COURSE",
  DELETE_COURSE: "DELETE_COURSE",

  // Attendance actions
  ADD_ATTENDANCE: "ADD_ATTENDANCE",
  UPDATE_ATTENDANCE: "UPDATE_ATTENDANCE",
  DELETE_ATTENDANCE: "DELETE_ATTENDANCE",
};

// Reducer function
const dataReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_STUDENT:
      return {
        ...state,
        students: [
          ...state.students,
          { ...action.payload, id: Date.now().toString() },
        ],
      };

    case ActionTypes.UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student
        ),
      };

    case ActionTypes.DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter(
          (student) => student.id !== action.payload
        ),
      };

    case ActionTypes.ADD_COURSE:
      return {
        ...state,
        courses: [
          ...state.courses,
          { ...action.payload, id: Date.now().toString() },
        ],
      };

    case ActionTypes.UPDATE_COURSE:
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id ? action.payload : course
        ),
      };

    case ActionTypes.DELETE_COURSE:
      return {
        ...state,
        courses: state.courses.filter((course) => course.id !== action.payload),
      };

    case ActionTypes.ADD_ATTENDANCE:
      return {
        ...state,
        attendanceData: [
          ...state.attendanceData,
          { ...action.payload, id: Date.now().toString() },
        ],
      };

    case ActionTypes.UPDATE_ATTENDANCE:
      return {
        ...state,
        attendanceData: state.attendanceData.map((attendance) =>
          attendance.id === action.payload.id ? action.payload : attendance
        ),
      };

    case ActionTypes.DELETE_ATTENDANCE:
      return {
        ...state,
        attendanceData: state.attendanceData.filter(
          (attendance) => attendance.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  students: initialStudents,
  courses: initialCourses,
  attendanceData: initialAttendanceData,
};

// Provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Student actions
  const addStudent = (studentData) => {
    dispatch({ type: ActionTypes.ADD_STUDENT, payload: studentData });
  };

  const updateStudent = (studentData) => {
    dispatch({ type: ActionTypes.UPDATE_STUDENT, payload: studentData });
  };

  const deleteStudent = (studentId) => {
    dispatch({ type: ActionTypes.DELETE_STUDENT, payload: studentId });
  };

  // Course actions
  const addCourse = (courseData) => {
    dispatch({ type: ActionTypes.ADD_COURSE, payload: courseData });
  };

  const updateCourse = (courseData) => {
    dispatch({ type: ActionTypes.UPDATE_COURSE, payload: courseData });
  };

  const deleteCourse = (courseId) => {
    dispatch({ type: ActionTypes.DELETE_COURSE, payload: courseId });
  };

  // Attendance actions
  const addAttendance = (attendanceData) => {
    dispatch({ type: ActionTypes.ADD_ATTENDANCE, payload: attendanceData });
  };

  const updateAttendance = (attendanceData) => {
    dispatch({ type: ActionTypes.UPDATE_ATTENDANCE, payload: attendanceData });
  };

  const deleteAttendance = (attendanceId) => {
    dispatch({ type: ActionTypes.DELETE_ATTENDANCE, payload: attendanceId });
  };

  // Calculate attendance statistics with real logic
  const calculateAttendanceStats = (studentId) => {
    const sid = String(studentId);
    const studentAttendance = state.attendanceData.filter(
      (attendance) => String(attendance.studentId) === sid
    );

    // If there are no granular attendance records for the student, fall back to
    // the aggregated `attendance` object on the student (useful when mock data
    // contains per-student summaries instead of per-day records).
    if (studentAttendance.length === 0) {
      const student = state.students.find((s) => String(s.id) === sid);
      if (student && student.attendance) {
        const a = student.attendance;
        const total = a.total ?? 0;
        const present = a.present ?? 0;
        const leave = a.leave ?? 0;
        const absent = a.absent ?? Math.max(0, total - present - leave);
        const percentage =
          typeof a.percentage === "number"
            ? a.percentage
            : total > 0
            ? (present / (present + absent)) * 100
            : 0;

        return {
          total,
          present,
          absent,
          leave,
          percentage: Math.round(percentage * 10) / 10,
        };
      }
    }

    const total = studentAttendance.length;
    const present = studentAttendance.filter(
      (a) => a.status === "present"
    ).length;
    const absent = studentAttendance.filter(
      (a) => a.status === "absent"
    ).length;
    const leave = studentAttendance.filter((a) => a.status === "leave").length;

    // Real calculation: Only present days count towards percentage
    // Leave days are considered as excused absences
    const effectiveTotal = present + absent; // Leave days don't count against attendance
    const percentage =
      effectiveTotal > 0 ? (present / effectiveTotal) * 100 : 0;

    return {
      total,
      present,
      absent,
      leave,
      percentage: Math.round(percentage * 10) / 10,
    };
  };

  // Calculate course grade average
  const calculateCourseAverage = (studentId) => {
    const student = state.students.find((s) => s.id === studentId);
    if (!student || !student.courses) return 0;

    const courseGrades = student.courses.map((courseName) => {
      const course = state.courses.find((c) => c.name === courseName);
      return course ? course.percentage : 0;
    });

    const average =
      courseGrades.length > 0
        ? courseGrades.reduce((sum, grade) => sum + grade, 0) /
          courseGrades.length
        : 0;

    return Math.round(average * 10) / 10;
  };

  // Calculate overall academic performance
  const calculateAcademicPerformance = (studentId) => {
    const attendanceStats = calculateAttendanceStats(studentId);
    const courseAverage = calculateCourseAverage(studentId);

    // Weighted calculation: 70% attendance + 30% academic performance
    const attendanceWeight = 0.7;
    const academicWeight = 0.3;

    const overallScore =
      attendanceStats.percentage * attendanceWeight +
      courseAverage * academicWeight;

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      attendanceScore: attendanceStats.percentage,
      academicScore: courseAverage,
      grade: getGradeFromScore(overallScore),
    };
  };

  // Convert score to letter grade
  const getGradeFromScore = (score) => {
    if (score >= 90) return "A+";
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 50) return "C-";
    if (score >= 45) return "D";
    return "F";
  };

  const value = {
    // State
    students: state.students,
    courses: state.courses,
    attendanceData: state.attendanceData,

    // Student actions
    addStudent,
    updateStudent,
    deleteStudent,

    // Course actions
    addCourse,
    updateCourse,
    deleteCourse,

    // Attendance actions
    addAttendance,
    updateAttendance,
    deleteAttendance,

    // Utility functions
    calculateAttendanceStats,
    calculateCourseAverage,
    calculateAcademicPerformance,
    getGradeFromScore,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
