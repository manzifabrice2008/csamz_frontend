import { useEffect } from "react";
import { authApi, studentAuthApi, teacherAuthApi } from "@/services/api";

const runWhenIdle = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};

  if ("requestIdleCallback" in window) {
    const idleHandle = window.requestIdleCallback(callback, { timeout: 1200 });
    return () => window.cancelIdleCallback(idleHandle);
  }

  const timeoutId = window.setTimeout(callback, 600);
  return () => window.clearTimeout(timeoutId);
};

const preloadPublicRoutes = () =>
  Promise.allSettled([
    import("@/pages/About"),
    import("@/pages/Contact"),
    import("@/pages/News"),
    import("@/pages/Blog"),
    import("@/pages/ApplyNow"),
  ]);

const preloadTeacherRoutes = () =>
  Promise.allSettled([
    import("@/pages/TeacherDashboard"),
    import("@/pages/TeacherStudents"),
    import("@/pages/TeacherExams"),
    import("@/pages/TeacherAnalytics"),
    import("@/pages/TeacherProfile"),
    import("@/pages/TeacherSettings"),
  ]);

const preloadStudentRoutes = () =>
  Promise.allSettled([
    import("@/pages/StudentDashboard"),
    import("@/pages/StudentExams"),
    import("@/pages/StudentResults"),
    import("@/pages/StudentProfile"),
    import("@/pages/StudentSettings"),
  ]);

const preloadAdminRoutes = () =>
  Promise.allSettled([
    import("@/pages/AdminOverview"),
    import("@/pages/AdminDashboard"),
    import("@/pages/AdminApplications"),
    import("@/pages/AdminTeachers"),
    import("@/pages/AdminStudents"),
  ]);

export default function RouteWarmup() {
  useEffect(() => {
    const cancelWarmup = runWhenIdle(() => {
      void preloadPublicRoutes();

      if (teacherAuthApi.isAuthenticated() || teacherAuthApi.getStoredTeacher()) {
        void preloadTeacherRoutes();
      }

      if (studentAuthApi.isAuthenticated() || studentAuthApi.getStoredStudent()) {
        void preloadStudentRoutes();
      }

      if (authApi.isAuthenticated() || authApi.getStoredUser()) {
        void preloadAdminRoutes();
      }
    });

    return cancelWarmup;
  }, []);

  return null;
}
