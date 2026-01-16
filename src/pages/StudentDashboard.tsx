import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentHistoryResult, studentAuthApi, examApi, ExamSummary } from "@/services/api";
import { Loader2, Rocket, CalendarDays, Clock4, BookOpen, ClipboardList, User, Settings, Home, FileText, Bell, Trophy } from "lucide-react";
import StudentAnalytics from "@/components/student/StudentAnalytics";
import StudentAssignments from "@/components/student/StudentAssignments";
import StudentAttendance from "@/components/student/StudentAttendance";
import StudentNotifications from "@/components/student/StudentNotifications";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Profile Settings Component
function ProfileSettings({ student }: { student: any }) {
  const [formData, setFormData] = useState({
    fullName: student?.full_name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Profile updated:', formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>Update your personal information and password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <Separator className="my-6" />

          <h4 className="text-sm font-medium">Change Password</h4>

          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Results Tab Component
function ResultsTab() {
  const [results, setResults] = useState<StudentHistoryResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await examApi.getStudentHistory();
        if (response.success) {
          setResults(response.results);
        }
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case 'B': return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case 'C': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-school-primary" />
          My Results
        </CardTitle>
        <CardDescription>History of all your taken exams and their outcomes.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">No results yet</p>
            <p>Once you take an exam, your results will appear here.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/student/exams">Take an Exam</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold">{result.examTitle}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(result.submittedAt).toLocaleDateString()}
                    <span>•</span>
                    <Clock4 className="w-3 h-3" />
                    {new Date(result.submittedAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                  <div className="text-right mr-4">
                    <div className="text-2xl font-bold">{result.percentage}%</div>
                    <div className="text-xs text-muted-foreground">
                      Score: {result.score}/{result.totalMarks}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getGradeColor(result.grade)} px-3 py-1 text-base`}>
                      Grade {result.grade}
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/student/exams/${result.examId}/result`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Exams Tab Component
function ExamsTab({ student }: { student: any }) {
  const [onlineExams, setOnlineExams] = useState<ExamSummary[]>([]);
  const [onlineLoading, setOnlineLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchOnlineExams = async () => {
      try {
        setOnlineLoading(true);
        const response = await examApi.list();
        setOnlineExams(response.exams);
      } catch (err) {
        console.error(err);
      } finally {
        setOnlineLoading(false);
      }
    };

    fetchOnlineExams();
  }, []);

  const tradeAlignedExams = useMemo(() => {
    if (!student?.trade) return onlineExams;
    return onlineExams.filter((exam) => {
      if (!exam.trade) return true;
      return exam.trade.toLowerCase() === student.trade.toLowerCase();
    });
  }, [onlineExams, student?.trade]);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-school-primary" />
            Online Exams
          </CardTitle>
          <CardDescription>
            Choose any published online exam, enter the exam code if required, and start immediately.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          {onlineLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-school-primary" />
            </div>
          ) : tradeAlignedExams.length === 0 ? (
            <div className="text-center py-12 space-y-3 text-muted-foreground">
              <ClipboardList className="w-10 h-10 mx-auto" />
              <p className="text-lg font-semibold">No exams available</p>
              <p>There are no published exams at this time.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/student/exams">View all exams</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tradeAlignedExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{exam.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exam.description || 'No description provided'}
                    </p>

                    {exam.total_marks && (
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <FileText className="w-4 h-4 mr-1" />
                        {exam.total_marks} marks
                      </div>
                    )}
                  </div>
                  <Button asChild>
                    <Link to={`/student/exams/${exam.id}`}>
                      Start Exam
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const student = useMemo(() => studentAuthApi.getStoredStudent(), []);
  const [recentResults, setRecentResults] = useState<StudentHistoryResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchRecentResults = async () => {
      try {
        const response = await examApi.getStudentHistory();
        if (response.success) {
          // Take top 3 most recent
          setRecentResults(response.results.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch recent results", error);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchRecentResults();
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case 'B': return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case 'C': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  return (
    <StudentLayout>
      <section className="py-8 px-4">
        <div className="container mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {student?.full_name}</p>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
            value={activeTab}
          >
            <ScrollArea className="w-full pb-2 md:pb-0">
              <TabsList className="w-full justify-start md:justify-center overflow-x-auto">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="assessments" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Exams</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Results</span>
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Assignments</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Attendance</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            <div className="mt-6">
              <TabsContent value="overview" className="space-y-6 focus-visible:outline-none focus:outline-none">
                <StudentAnalytics />

                {/* Recent Results Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-school-primary" />
                      Recent Results
                    </CardTitle>
                    <CardDescription>Your latest exam performance.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingResults ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-school-primary" />
                      </div>
                    ) : recentResults.length === 0 ? (
                      <p className="text-center text-muted-foreground py-6">No recent exam results found.</p>
                    ) : (
                      <div className="space-y-4">
                        {recentResults.map((result) => (
                          <div key={result.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                              <p className="font-medium">{result.examTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(result.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <span className="font-mono font-medium">{result.percentage}%</span>
                                <Badge variant="secondary" className={getGradeColor(result.grade)}>
                                  {result.grade}
                                </Badge>
                              </div>
                              <Link
                                to={`/student/exams/${result.examId}/result`}
                                className="text-xs text-school-primary hover:underline mt-1 inline-block"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                        <Button asChild variant="outline" className="w-full mt-2">
                          <Link to="/student/results">View All History</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessments" className="space-y-6 focus-visible:outline-none focus:outline-none">
                <ExamsTab student={student} />
              </TabsContent>

              <TabsContent value="results" className="space-y-6 focus-visible:outline-none focus:outline-none">
                <ResultsTab />
              </TabsContent>

              <TabsContent value="assignments" className="space-y-6 focus-visible:outline-none focus:outline-none">
                <StudentAssignments />
              </TabsContent>

              <TabsContent value="attendance" className="space-y-6 focus-visible:outline-none focus:outline-none">
                <StudentAttendance />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6 focus-visible:outline-none focus:outline-none">
                <StudentNotifications />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 focus-visible:outline-none focus:outline-none">
                <ProfileSettings student={student} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
    </StudentLayout>
  );
}


