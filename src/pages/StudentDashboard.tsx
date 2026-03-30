import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExamResultResponse, StudentHistoryResult, studentAuthApi, examApi } from "@/services/api";
import { Loader2, Medal, Rocket, Send, Trophy, Users } from "lucide-react";
import StudentAnalytics from "@/components/student/StudentAnalytics";

export default function StudentDashboard() {
  const student = useMemo(() => studentAuthApi.getStoredStudent(), []);
  const [allResults, setAllResults] = useState<StudentHistoryResult[]>([]);
  const [recentResults, setRecentResults] = useState<StudentHistoryResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [selectedPublishedExamId, setSelectedPublishedExamId] = useState<string>("");
  const [selectedPublishedResult, setSelectedPublishedResult] = useState<ExamResultResponse | null>(null);
  const [loadingPublishedResult, setLoadingPublishedResult] = useState(false);

  useEffect(() => {
    const fetchRecentResults = async () => {
      try {
        const response = await examApi.getStudentHistory();
        if (response.success) {
          setAllResults(response.results);
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

  const publishedResults = useMemo(
    () => allResults.filter((result) => result.gradesPublished),
    [allResults]
  );

  useEffect(() => {
    if (publishedResults.length === 0) {
      setSelectedPublishedExamId("");
      setSelectedPublishedResult(null);
      return;
    }

    if (!selectedPublishedExamId || !publishedResults.some((result) => result.examId === selectedPublishedExamId)) {
      setSelectedPublishedExamId(publishedResults[0].examId);
    }
  }, [publishedResults, selectedPublishedExamId]);

  useEffect(() => {
    const fetchPublishedExamResult = async () => {
      if (!student?.id || !selectedPublishedExamId) {
        setSelectedPublishedResult(null);
        return;
      }

      try {
        setLoadingPublishedResult(true);
        const response = await examApi.getResult(student.id, selectedPublishedExamId);
        setSelectedPublishedResult(response);
      } catch (error) {
        console.error("Failed to fetch published exam result", error);
        setSelectedPublishedResult(null);
      } finally {
        setLoadingPublishedResult(false);
      }
    };

    fetchPublishedExamResult();
  }, [selectedPublishedExamId, student?.id]);

  const selectedPublishedSummary = useMemo(
    () => publishedResults.find((result) => result.examId === selectedPublishedExamId) || null,
    [publishedResults, selectedPublishedExamId]
  );

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
                <Send className="w-5 h-5 text-school-primary" />
                Published Exams
              </CardTitle>
              <CardDescription>
                Choose a published exam to see when it was published and the marks of all students in that subject.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingResults ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-school-primary" />
                </div>
              ) : publishedResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No published exams yet. Your teacher will publish marks here when they are ready.
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Published Exam / Subject</p>
                    <Select value={selectedPublishedExamId} onValueChange={setSelectedPublishedExamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a published exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {publishedResults.map((result) => (
                          <SelectItem key={result.examId} value={result.examId}>
                            {result.examTitle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {loadingPublishedResult ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-school-primary" />
                    </div>
                  ) : selectedPublishedResult && selectedPublishedSummary ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Trophy className="w-4 h-4" />
                              Published Subject
                            </div>
                            <p className="mt-2 text-xl font-bold">{selectedPublishedSummary.examTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedPublishedSummary.trade || "General")} {selectedPublishedSummary.level ? `- ${selectedPublishedSummary.level}` : ""}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Send className="w-4 h-4" />
                              Published On
                            </div>
                            <p className="mt-2 text-xl font-bold">
                              {selectedPublishedResult.exam.grades_published_at
                                ? new Date(selectedPublishedResult.exam.grades_published_at).toLocaleDateString()
                                : "Published"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedPublishedResult.exam.grades_published_at
                                ? new Date(selectedPublishedResult.exam.grades_published_at).toLocaleTimeString()
                                : "Teacher has released the marks"}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Medal className="w-4 h-4" />
                              Your Marks
                            </div>
                            <p className="mt-2 text-xl font-bold">
                              {selectedPublishedResult.result.score} / {selectedPublishedSummary.totalMarks}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedPublishedSummary.percentage}% - Grade {selectedPublishedSummary.grade}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              Class Place
                            </div>
                            <p className="mt-2 text-xl font-bold">
                              {selectedPublishedResult.result.rank ? `#${selectedPublishedResult.result.rank}` : "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedPublishedResult.ranking?.length
                                ? `Out of ${selectedPublishedResult.ranking.length} students`
                                : "Published class ranking"}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold">All Student Marks In This Subject</h3>
                            <p className="text-sm text-muted-foreground">
                              Published ranking and marks for all students who took this exam.
                            </p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/student/exams/${selectedPublishedSummary.examId}/result`}>Open Full Result</Link>
                          </Button>
                        </div>

                        {selectedPublishedResult.ranking && selectedPublishedResult.ranking.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Place</TableHead>
                                  <TableHead>Student</TableHead>
                                  <TableHead>Username</TableHead>
                                  <TableHead className="text-right">Marks</TableHead>
                                  <TableHead className="text-right">Percentage</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedPublishedResult.ranking.map((entry) => {
                                  const isCurrentStudent = String(entry.student_id) === String(student?.id);

                                  return (
                                    <TableRow key={`${entry.student_id}-${entry.rank}`} className={isCurrentStudent ? "bg-school-primary/5" : ""}>
                                      <TableCell className="font-semibold">#{entry.rank}</TableCell>
                                      <TableCell className="font-medium">
                                        {entry.full_name}
                                        {isCurrentStudent ? <Badge variant="secondary" className="ml-2">You</Badge> : null}
                                      </TableCell>
                                      <TableCell className="text-muted-foreground">{entry.username || "-"}</TableCell>
                                      <TableCell className="text-right font-mono">
                                        {entry.score} / {entry.total_marks}
                                      </TableCell>
                                      <TableCell className="text-right font-mono">{entry.percentage}%</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No published student marks found for this exam yet.</p>
                        )}
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>

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
                          {result.gradesPublished
                            ? result.rank
                              ? `Place ${result.rank} in your class`
                              : "Published marks are available"
                            : "Waiting for teacher to publish class ranking"}
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
