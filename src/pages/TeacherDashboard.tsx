import { useEffect, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherStatsApi, teacherAuthApi, teacherExamApi, teacherStudentsApi, ExamSummary, TeacherStudent } from "@/services/api";
import { Users, FileText, CheckCircle, BarChart, ExternalLink, ClipboardList, ArrowRight, Mail, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    pendingGrading: 0,
    totalExams: 0,
    trade: '',
  });
  const [createdExams, setCreatedExams] = useState<ExamSummary[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const teacher = teacherAuthApi.getStoredTeacher();
  const tradeSummary = teacher?.trades?.length ? teacher.trades.join(", ") : stats.trade;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, examsResponse, studentsResponse] = await Promise.all([
          teacherStatsApi.get(),
          teacherExamApi.list(),
          teacherStudentsApi.getAll(),
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.stats);
        }

        if (examsResponse.success) {
          setCreatedExams(examsResponse.exams.slice(0, 5));
        }

        if (studentsResponse.success) {
          setAssignedStudents(studentsResponse.students);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatExamDate = (date?: string) => {
    if (!date) return "Recently created";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Recently created";
    return parsed.toLocaleDateString();
  };

  const groupedStudents = assignedStudents.reduce<Record<string, TeacherStudent[]>>((groups, student) => {
    const level = student.level || "No Level";
    if (!groups[level]) {
      groups[level] = [];
    }
    groups[level].push(student);
    return groups;
  }, {});

  const orderedLevels = Object.keys(groupedStudents).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <TeacherLayout>
      <div className="p-6 space-y-6">
        <div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {teacher?.full_name}. Here's what's happening in your {tradeSummary || 'classes'}.
            </p>
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
              <p className="text-xs text-muted-foreground">Enrolled in {tradeSummary || "your classes"}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-school-primary" />
                  Created Exams
                </CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/teacher/exams">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading exams...</p>
              ) : createdExams.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No exams created yet.
                </div>
              ) : (
                createdExams.map((exam) => (
                  <Link
                    key={exam.id}
                    to="/teacher/exams"
                    className="block rounded-lg border p-4 transition hover:border-school-primary/60 hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium leading-none">{exam.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.trade || "General"} • {exam.level}
                        </p>
                      </div>
                      {exam.exam_code ? (
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                          {exam.exam_code}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{exam.question_count ?? 0} questions</span>
                      <span>{formatExamDate(exam.created_at)}</span>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-school-primary" />
                  Students In Your Classes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Registered in your assigned trades and class levels.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/teacher/students">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading students...</p>
              ) : assignedStudents.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No students have registered in your classes yet.
                </div>
              ) : (
                orderedLevels.map((level) => (
                  <div key={level} className="rounded-xl border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-school-primary" />
                        <span className="font-medium">{level}</span>
                      </div>
                      <Badge variant="secondary">{groupedStudents[level].length} students</Badge>
                    </div>
                    <div className="space-y-3">
                      {groupedStudents[level].slice(0, 4).map((student) => (
                        <Link
                          key={student.id}
                          to={`/teacher/students/${student.id}`}
                          className="flex items-start justify-between gap-3 rounded-lg border bg-muted/20 p-3 transition hover:border-school-primary/50 hover:bg-muted/40"
                        >
                          <div className="space-y-1">
                            <p className="font-medium leading-none">{student.full_name}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {student.trade}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {student.email || "No email"}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={student.status === "active" ? "default" : "secondary"}
                            className={student.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {student.status}
                          </Badge>
                        </Link>
                      ))}
                      {groupedStudents[level].length > 4 ? (
                        <p className="text-xs text-muted-foreground">
                          +{groupedStudents[level].length - 4} more students in {level}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

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

          <Card className="bg-gradient-to-br from-school-primary to-blue-700 text-white md:col-span-2">
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
