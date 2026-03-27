import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { studentAnalyticsApi, studentAuthApi, examApi, StudentHistoryResult } from "@/services/api";
import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Edit,
  Settings,
  FileText,
  Target,
  Users,
  Loader2,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

interface StudentStats {
  averageScore: number;
  examsTaken: number;
  upcomingExams: number;
  pendingAssignments: number;
  attendance: number;
  level: string;
  trade: string;
}

interface RecentActivity {
  id: string;
  type: "exam" | "assessment" | "assignment";
  title: string;
  score?: number;
  totalPoints?: number;
  status: "completed" | "pending" | "upcoming";
  date: string;
}

export default function StudentProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState<StudentStats>({
    averageScore: 0,
    examsTaken: 0,
    upcomingExams: 0,
    pendingAssignments: 0,
    attendance: 0,
    level: "N/A",
    trade: "N/A",
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);

        const [studentRes, statsRes, historyRes, examsRes] = await Promise.all([
          studentAuthApi.getCurrentStudent(),
          studentAnalyticsApi.getStats(),
          examApi.getStudentHistory(),
          examApi.list(),
        ]);

        if (studentRes.success) {
          setStudent(studentRes.student);
        }

        let examsTakenCount = 0;
        let recentActivities: RecentActivity[] = [];

        if (historyRes.success) {
          examsTakenCount = historyRes.results.length;
          recentActivities = historyRes.results.map((result: StudentHistoryResult) => ({
            id: `exam-${result.id}`,
            type: "exam",
            title: result.examTitle,
            score: result.score,
            totalPoints: result.totalMarks,
            status: "completed",
            date: result.submittedAt,
          }));
        }

        let upcomingExamsCount = 0;
        if (examsRes.success) {
          upcomingExamsCount = Math.max(0, examsRes.exams.length - examsTakenCount);
        }

        const analytics = statsRes.success
          ? statsRes.stats
          : { attendance: 0, assignments: 0, grades: 0 };

        setStats({
          averageScore: analytics.grades,
          examsTaken: examsTakenCount,
          upcomingExams: upcomingExamsCount,
          pendingAssignments: analytics.assignments || 0,
          attendance: analytics.attendance,
          level: studentRes.success ? (studentRes.student.level || "N/A") : "N/A",
          trade: studentRes.success ? (studentRes.student.trade || "N/A") : "N/A",
        });

        setRecentActivity(recentActivities.slice(0, 5));
      } catch (error) {
        console.error("Failed to load profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load some profile information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [toast]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <FileText className="w-4 h-4" />;
      case "assessment":
        return <BookOpen className="w-4 h-4" />;
      case "assignment":
        return <Target className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const progressLabel = useMemo(() => {
    if (stats.averageScore >= 80) return "Excellent";
    if (stats.averageScore >= 70) return "Strong";
    if (stats.averageScore >= 50) return "Growing";
    return "Needs Focus";
  }, [stats.averageScore]);

  const profileHighlights = [
    {
      label: "Program",
      value: stats.trade,
      icon: BookOpen,
    },
    {
      label: "Class Level",
      value: stats.level,
      icon: Award,
    },
    {
      label: "Attendance",
      value: `${stats.attendance}%`,
      icon: ShieldCheck,
    },
  ];

  const infoCards = [
    {
      label: "Email",
      value: student?.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Phone",
      value: student?.phone_number || "Not provided",
      icon: Phone,
    },
    {
      label: "Trade",
      value: student?.trade || "Not specified",
      icon: BookOpen,
    },
    {
      label: "Level",
      value: student?.level || "Not specified",
      icon: Award,
    },
    {
      label: "Enrollment Date",
      value: student?.created_at ? new Date(student.created_at).toLocaleDateString() : "Not available",
      icon: Calendar,
    },
    {
      label: "Institution",
      value: "CSAMZ Technical School",
      icon: MapPin,
    },
  ];

  const statCards = [
    {
      label: "Average Score",
      value: `${stats.averageScore}%`,
      hint: "Across graded exams",
      icon: TrendingUp,
    },
    {
      label: "Exams Taken",
      value: `${stats.examsTaken}`,
      hint: "Completed attempts",
      icon: FileText,
    },
    {
      label: "Upcoming",
      value: `${stats.upcomingExams}`,
      hint: "Available to sit",
      icon: Calendar,
    },
    {
      label: "Assignments",
      value: `${stats.pendingAssignments}`,
      hint: "Pending work",
      icon: Target,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
      </div>
    );
  }

  return (
    <StudentLayout>
      <div className="container mx-auto max-w-6xl space-y-6 p-4">
        <Card className="group overflow-hidden border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,196,0,0.26),transparent_30%)]" />
            <div className="h-36 bg-[linear-gradient(120deg,#154a8a_0%,#2b647d_35%,#63733d_70%,#f0b300_100%)]" />
          </div>

          <CardContent className="relative -mt-14 space-y-6 p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <Avatar className="h-28 w-28 border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-[1.03]">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={student?.full_name} />
                  <AvatarFallback className="bg-school-primary text-3xl font-bold text-white">
                    {student?.full_name ? getInitials(student.full_name) : "ST"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-3 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-0 bg-white/85 px-3 py-1 text-slate-900 shadow-sm backdrop-blur">
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      Student Profile
                    </Badge>
                    <Badge variant="secondary" className="bg-school-primary/10 text-school-primary">
                      {stats.level}
                    </Badge>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      {student?.full_name || "Student Name"}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {student?.trade || "Trade"} Student
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Student ID: {student?.id || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {profileHighlights.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-2 text-sm shadow-sm backdrop-blur"
                        >
                          <Icon className="h-4 w-4 text-school-primary" />
                          <span className="text-muted-foreground">{item.label}:</span>
                          <span className="font-medium text-foreground">{item.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                  <Link to="/student/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button asChild className="h-11 rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800 dark:bg-school-primary dark:hover:bg-school-primary/90">
                  <Link to="/student/settings">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="h-5 w-5 text-school-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="mt-1 text-base">
                    Your academic identity and contact details in one place.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex">
                  Live profile
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {infoCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-school-primary/30 hover:shadow-md"
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-school-primary/10 text-school-primary transition-colors group-hover:bg-school-primary group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="mt-1 break-words text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BarChart3 className="h-5 w-5 text-school-primary" />
                Quick Stats
              </CardTitle>
              <CardDescription className="text-base">
                Your performance snapshot with live progress indicators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {statCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group rounded-2xl border border-border/60 bg-gradient-to-br from-slate-50 to-white p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-school-primary/30 hover:shadow-lg dark:from-muted/70 dark:to-card"
                    >
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/10 text-school-primary transition-all duration-200 group-hover:scale-110 group-hover:bg-school-primary group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-3xl font-bold tracking-tight text-school-primary">{item.value}</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{item.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.hint}</div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Academic Progress</p>
                    <p className="text-xs text-muted-foreground">Based on your current average score</p>
                  </div>
                  <Badge className="bg-school-primary/10 text-school-primary hover:bg-school-primary/10">
                    {progressLabel}
                  </Badge>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#154a8a_0%,#2c6580_50%,#f0b300_100%)] transition-all duration-700"
                    style={{ width: `${Math.max(8, stats.averageScore)}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Button asChild variant="outline" className="h-12 justify-between rounded-xl">
                  <Link to="/student/results">
                    <span className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      View All Results
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 justify-between rounded-xl">
                  <Link to="/student/exams">
                    <span className="flex items-center">
                      <Target className="mr-2 h-4 w-4" />
                      Explore Exams
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Clock className="h-5 w-5 text-school-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-base">
                  Track your latest academic milestones and submissions.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" className="justify-start sm:justify-center">
                <Link to="/student/dashboard">
                  <Users className="mr-2 h-4 w-4" />
                  View Full Dashboard
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <p className="text-lg font-medium">No recent activity yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your completed exams and academic updates will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-gradient-to-r from-background to-muted/20 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-school-primary/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-school-primary/10 text-school-primary transition-colors group-hover:bg-school-primary group-hover:text-white">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{activity.title}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                          {activity.score !== undefined && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                Score: {activity.score}/{activity.totalPoints}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activity.score !== undefined && (
                        <div className="rounded-xl bg-muted px-3 py-2 text-right">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Result</p>
                          <p className="font-semibold text-foreground">
                            {Math.round((activity.score / (activity.totalPoints || 1)) * 100)}%
                          </p>
                        </div>
                      )}
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
