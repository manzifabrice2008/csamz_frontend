import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentHistoryResult, studentAuthApi, examApi } from "@/services/api";
import { Loader2, Medal, Rocket } from "lucide-react";
import StudentAnalytics from "@/components/student/StudentAnalytics";

export default function StudentDashboard() {
  const student = useMemo(() => studentAuthApi.getStoredStudent(), []);
  const [recentResults, setRecentResults] = useState<StudentHistoryResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchRecentResults = async () => {
      try {
        const response = await examApi.getStudentHistory();
        if (response.success) {
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
      case "A":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "B":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "C":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  return (
    <StudentLayout>
      <section className="py-8 px-4">
        <div className="container mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {student?.full_name}</p>
            </div>
          </div>

          <StudentAnalytics />

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
                          {result.level ? ` - ${result.level.replace("L", "Level ")}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="font-mono font-medium">{result.percentage}%</span>
                          <Badge variant="secondary" className={getGradeColor(result.grade)}>
                            {result.grade}
                          </Badge>
                          {result.rank ? (
                            <Badge variant="outline" className="gap-1">
                              <Medal className="h-3 w-3" />
                              #{result.rank}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {result.rank
                            ? `Place ${result.rank} in your class`
                            : "Grade recorded for this exam"}
                        </p>
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
        </div>
      </section>
    </StudentLayout>
  );
}
