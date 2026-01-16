import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { studentAnalyticsApi, studentAuthApi, examApi, StudentHistoryResult } from "@/services/api";
import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
    averageScore: 85,
    examsTaken: 12,
    upcomingExams: 3,
    pendingAssignments: 2,
    attendance: 94,
    level: "L3",
    trade: "Software Development",
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        // Parallel data fetching
        const [studentRes, statsRes, historyRes, examsRes] = await Promise.all([
          studentAuthApi.getCurrentStudent(),
          studentAnalyticsApi.getStats(),
          examApi.getStudentHistory(),
          examApi.list() // To get total available exams for "upcoming" calculation
        ]);

        if (studentRes.success) {
          setStudent(studentRes.student);
        }

        let examsTakenCount = 0;
        let recentActivities: RecentActivity[] = [];

        if (historyRes.success) {
          examsTakenCount = historyRes.results.length;

          // Map history to recent activity
          recentActivities = historyRes.results.map((result: StudentHistoryResult) => ({
            id: `exam-${result.id}`,
            type: "exam",
            title: result.examTitle,
            score: result.score,
            totalPoints: result.totalMarks,
            status: "completed",
            date: result.submittedAt
          }));
        }

        let upcomingExamsCount = 0;
        if (examsRes.success) {
          // Simple calculation: Total exams - taken exams (not perfect but better than hardcoded)
          // If we had a better "upcoming" API we would use it.
          const totalExams = examsRes.exams.length;
          upcomingExamsCount = Math.max(0, totalExams - examsTakenCount);
        }

        let statsData = {
          attendance: 0,
          assignments: 0,
          grades: 0
        };

        if (statsRes.success) {
          statsData = statsRes.stats;
        }

        setStats({
          averageScore: statsData.grades,
          examsTaken: examsTakenCount,
          upcomingExams: upcomingExamsCount,
          pendingAssignments: 0, // We don't have this explicitly yet, keeping 0 or could assume from assignments API if needed
          attendance: statsData.attendance,
          level: studentRes.success ? (studentRes.student.level || "N/A") : "N/A",
          trade: studentRes.success ? (studentRes.student.trade || "N/A") : "N/A",
        });

        setRecentActivity(recentActivities.slice(0, 5)); // Show top 5 recent

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



  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <StudentLayout>
      <div className="container mx-auto p-4 space-y-6 max-w-6xl">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-school-primary to-school-accent h-24"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src="/placeholder-avatar.jpg" alt={student?.full_name} />
                <AvatarFallback className="bg-school-primary text-white text-2xl font-bold">
                  {student?.full_name ? getInitials(student.full_name) : 'ST'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-foreground">
                  {student?.full_name || "Student Name"}
                </h1>
                <p className="text-muted-foreground">
                  {student?.trade || "Trade"} • {student?.level || "Level 3"} Student
                </p>
                <p className="text-sm text-muted-foreground">
                  Student ID: {student?.id || "N/A"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/student/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/student/dashboard">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {student?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {student?.phone_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Trade</p>
                    <p className="text-sm text-muted-foreground">
                      {student?.trade || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Level</p>
                    <p className="text-sm text-muted-foreground">
                      {student?.level || "Level 3"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Enrollment Date</p>
                    <p className="text-sm text-muted-foreground">
                      {student?.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : "Not available"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Institution</p>
                    <p className="text-sm text-muted-foreground">
                      CSAMZ Technical School
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Stats
              </CardTitle>
              <CardDescription>Your academic performance overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-school-primary">
                    {stats.averageScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Average Score</div>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-school-primary">
                    {stats.examsTaken}
                  </div>
                  <div className="text-xs text-muted-foreground">Exams Taken</div>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-school-primary">
                    {stats.upcomingExams}
                  </div>
                  <div className="text-xs text-muted-foreground">Upcoming</div>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-school-primary">
                    {stats.attendance}%
                  </div>
                  <div className="text-xs text-muted-foreground">Attendance</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Academic Progress</span>
                  <span className="font-medium">Excellent</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-school-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.averageScore}%` }}
                  ></div>
                </div>
              </div>

              <Button asChild className="w-full" variant="outline">
                <Link to="/student/results">
                  <FileText className="w-4 h-4 mr-2" />
                  View All Results
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest academic activities and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-school-primary/10 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.date).toLocaleDateString()}
                        {activity.score !== undefined && (
                          <span>• Score: {activity.score}/{activity.totalPoints}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link to="/student/dashboard">
                  <Users className="w-4 h-4 mr-2" />
                  View Full Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
