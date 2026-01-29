import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import LoadingScreen from "./components/LoadingScreen";
import AnalyticsTracker from "./components/AnalyticsTracker";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SoftwareDevelopment = lazy(() => import("./pages/SoftwareDevelopment"));
const ComputerSystems = lazy(() => import("./pages/ComputerSystems"));
const PlumbingTechnology = lazy(() => import("./pages/PlumbingTechnology"));
const BuildingConstruction = lazy(() => import("./pages/BuildingConstruction"));
const WoodTechnology = lazy(() => import("./pages/WoodTechnology"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminRegister = lazy(() => import("./pages/AdminRegister"));
const ApplyNow = lazy(() => import("./pages/ApplyNow"));
const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const AdminOverview = lazy(() => import("./pages/AdminOverview"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminStudents = lazy(() => import("./pages/AdminStudents"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const SubmitTestimonial = lazy(() => import("./pages/SubmitTestimonial"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const StudentLogin = lazy(() => import("./pages/StudentLogin"));
const StudentRegister = lazy(() => import("./pages/StudentRegister"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const StudentProtectedRoute = lazy(() => import("./components/StudentProtectedRoute"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const SchoolGallery = lazy(() => import("./pages/SchoolGallery"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const TeacherLogin = lazy(() => import("./pages/TeacherLogin"));
const TeacherRegister = lazy(() => import("./pages/TeacherRegister"));
const TeacherProtectedRoute = lazy(() => import("./components/TeacherProtectedRoute"));
const TeacherExams = lazy(() => import("./pages/TeacherExams"));
const TeacherExamResults = lazy(() => import("./pages/TeacherExamResults"));
const TeacherStudents = lazy(() => import("./pages/TeacherStudents"));
const TeacherStudentDetail = lazy(() => import("./pages/TeacherStudentDetail"));
const TeacherAssignments = lazy(() => import("./pages/TeacherAssignments"));
const TeacherAttendance = lazy(() => import("./pages/TeacherAttendance"));
const TeacherAnalytics = lazy(() => import("./pages/TeacherAnalytics"));
const TeacherAssessments = lazy(() => import("./pages/TeacherAssessments"));
const TeacherProfile = lazy(() => import("./pages/TeacherProfile"));
const TeacherSettings = lazy(() => import("./pages/TeacherSettings"));
const AdminTeachers = lazy(() => import("./pages/AdminTeachers"));
const StudentExams = lazy(() => import("./pages/StudentExams"));

const StudentExamTake = lazy(() => import("./pages/StudentExamTake"));
const StudentExamResult = lazy(() => import("./pages/StudentExamResult"));
const StudentResults = lazy(() => import("./pages/StudentResults"));
const StudentSettings = lazy(() => import("./pages/StudentSettings"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsTracker />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/programs/software-development" element={<SoftwareDevelopment />} />
              <Route path="/programs/computer-systems" element={<ComputerSystems />} />
              <Route path="/programs/plumbing-technology" element={<PlumbingTechnology />} />
              <Route path="/programs/building-construction" element={<BuildingConstruction />} />
              <Route path="/programs/wood-technology" element={<WoodTechnology />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/gallery" element={<SchoolGallery />} />
              <Route path="/apply" element={<ApplyNow />} />
              <Route path="/teacher/login" element={<TeacherLogin />} />
              <Route path="/teacher/register" element={<TeacherRegister />} />
              <Route
                path="/teacher/dashboard"
                element={
                  <TeacherProtectedRoute>
                    <TeacherDashboard />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/exams"
                element={
                  <TeacherProtectedRoute>
                    <TeacherExams />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/exams/:examId/results"
                element={
                  <TeacherProtectedRoute>
                    <TeacherExamResults />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/students"
                element={
                  <TeacherProtectedRoute>
                    <TeacherStudents />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/students/:id"
                element={
                  <TeacherProtectedRoute>
                    <TeacherStudentDetail />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/assignments"
                element={
                  <TeacherProtectedRoute>
                    <TeacherAssignments />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/attendance"
                element={
                  <TeacherProtectedRoute>
                    <TeacherAttendance />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/analytics"
                element={
                  <TeacherProtectedRoute>
                    <TeacherAnalytics />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/assessments"
                element={
                  <TeacherProtectedRoute>
                    <TeacherAssessments />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/profile"
                element={
                  <TeacherProtectedRoute>
                    <TeacherProfile />
                  </TeacherProtectedRoute>
                }
              />
              <Route
                path="/teacher/settings"
                element={
                  <TeacherProtectedRoute>
                    <TeacherSettings />
                  </TeacherProtectedRoute>
                }
              />
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/student/register" element={<StudentRegister />} />
              <Route
                path="/student/dashboard"
                element={
                  <StudentProtectedRoute>
                    <StudentDashboard />
                  </StudentProtectedRoute>
                }
              />
              <Route
                path="/student/exams"
                element={
                  <StudentProtectedRoute>
                    <StudentExams />
                  </StudentProtectedRoute>
                }
              />
              <Route
                path="/student/exams/:examId"
                element={
                  <StudentProtectedRoute>
                    <StudentExamTake />
                  </StudentProtectedRoute>
                }
              />

              <Route
                path="/student/exams/:examId/result"
                element={
                  <StudentProtectedRoute>
                    <StudentExamResult />
                  </StudentProtectedRoute>
                }
              />
              <Route
                path="/student/results"
                element={
                  <StudentProtectedRoute>
                    <StudentResults />
                  </StudentProtectedRoute>
                }
              />
              <Route
                path="/student/settings"
                element={
                  <StudentProtectedRoute>
                    <StudentSettings />
                  </StudentProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <StudentProtectedRoute>
                    <StudentProfile />
                  </StudentProtectedRoute>
                }
              />
              <Route path="/testimonial/submit" element={<SubmitTestimonial />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin" element={<ProtectedRoute><AdminOverview /></ProtectedRoute>} />
              <Route path="/admin/overview" element={<ProtectedRoute><AdminOverview /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
              <Route path="/admin/teachers" element={<ProtectedRoute><AdminTeachers /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
