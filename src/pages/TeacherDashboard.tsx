import { useEffect, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherStatsApi, teacherAuthApi } from "@/services/api";
import { Users, FileText, CheckCircle, BarChart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    pendingGrading: 0,
    totalExams: 0,
    trade: '',
  });
  const [loading, setLoading] = useState(true);
  const teacher = teacherAuthApi.getStoredTeacher();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await teacherStatsApi.get();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <TeacherLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {teacher?.full_name}. Here's what's happening in your {stats.trade || 'classes'}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/teacher/exams/create">Create Exam</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/teacher/assignments">Post Assignment</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/teacher/students'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Enrolled in {stats.trade}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/teacher/assignments'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">Posted assignments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/teacher/assignments'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingGrading}</div>
              <p className="text-xs text-muted-foreground">Submissions to mark</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/teacher/exams'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground">Created exams</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions / Recent Activity could go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link to="/teacher/attendance">
                  <Users className="h-6 w-6" />
                  <span>Mark Attendance</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link to="/teacher/assignments">
                  <FileText className="h-6 w-6" />
                  <span>Manage Assignments</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link to="/teacher/exams">
                  <CheckCircle className="h-6 w-6" />
                  <span>Online Exams</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link to="/teacher/analytics">
                  <BarChart className="h-6 w-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-school-primary to-blue-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-blue-100">
                Check out the teacher resources guide to learn how to effectively use the portal for your classes.
              </p>
              <Button variant="secondary" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Access Teacher Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
