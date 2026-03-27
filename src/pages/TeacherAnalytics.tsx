import { useEffect, useMemo, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
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
import { teacherAuthApi, teacherExamApi, ExamSummary, TeacherExamResult } from "@/services/api";
import { Loader2, Download, TrendingUp, Medal, BarChart3, Users, ClipboardList, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ExamStats {
  total_submissions: number;
  pass_count: number;
  fail_count: number;
  winning_rate: number;
  average_score: number;
}

interface RankedExamResult extends TeacherExamResult {
  examTitle: string;
  examCode?: string | null;
  examLevel?: string;
  examTrade?: string | null;
}

const normalizeTrade = (value?: string | null) => (value || "").trim().toLowerCase();
const normalizeLevel = (value?: string | null) => (value || "").trim().toUpperCase();

const formatExamLabel = (exam: ExamSummary) => {
  const code = exam.exam_code ? `${exam.exam_code} - ` : "";
  const subject = exam.title || "Untitled Exam";
  const meta = [exam.trade, exam.level].filter(Boolean).join(" • ");

  return {
    primary: `${code}${subject}`,
    secondary: meta || "Exam",
  };
};

export default function TeacherAnalytics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [teacherProfile, setTeacherProfile] = useState(teacherAuthApi.getStoredTeacher());
  const [selectedTrade, setSelectedTrade] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedExamId, setSelectedExamId] = useState<string>("all");
  const [selectedExamTitle, setSelectedExamTitle] = useState("");
  const [results, setResults] = useState<RankedExamResult[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);

  const allowedTrades = useMemo(
    () =>
      [...new Set(
        [
          ...(teacherProfile?.trades || []),
          ...(teacherProfile?.trade ? [teacherProfile.trade] : []),
          ...exams.map((exam) => exam.trade || "").filter(Boolean),
        ]
          .map((trade) => trade?.trim())
          .filter(Boolean)
      )] as string[],
    [exams, teacherProfile]
  );

  const allowedLevels = useMemo(
    () =>
      [...new Set(
        [
          ...(teacherProfile?.levels || []),
          ...(teacherProfile?.level ? [teacherProfile.level] : []),
          ...exams.map((exam) => exam.level || "").filter(Boolean),
        ]
          .map((level) => level?.trim().toUpperCase())
          .filter(Boolean)
      )]
        .sort() as string[],
    [exams, teacherProfile]
  );

  useEffect(() => {
    if (selectedTrade !== "all" && allowedTrades.length > 0 && !allowedTrades.includes(selectedTrade)) {
      setSelectedTrade("all");
    }
  }, [allowedTrades, selectedTrade]);

  useEffect(() => {
    if (selectedLevel !== "all" && allowedLevels.length > 0 && !allowedLevels.includes(selectedLevel)) {
      setSelectedLevel("all");
    }
  }, [allowedLevels, selectedLevel]);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [examResponse, teacherResponse] = await Promise.all([
          teacherExamApi.list(),
          teacherAuthApi.getCurrentTeacher(),
        ]);

        if (examResponse.success) {
          setExams(examResponse.exams);
        }

        if (teacherResponse.success) {
          setTeacherProfile(teacherResponse.teacher);
        }
      } catch (error: any) {
        const message = error?.message || "Please try again.";
        toast({
          title: "Failed to load results page data",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [toast]);

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesTrade =
        selectedTrade === "all" || normalizeTrade(exam.trade) === normalizeTrade(selectedTrade);
      const matchesLevel =
        selectedLevel === "all" || normalizeLevel(exam.level) === normalizeLevel(selectedLevel);

      return matchesTrade && matchesLevel;
    });
  }, [exams, selectedTrade, selectedLevel]);

  useEffect(() => {
    if (filteredExams.length === 0) {
      setSelectedExamId("all");
      return;
    }

    if (selectedExamId !== "all" && !filteredExams.some((exam) => exam.id === selectedExamId)) {
      setSelectedExamId("all");
    }
  }, [filteredExams, selectedExamId]);

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedExamId) {
        setResults([]);
        setStats(null);
        setSelectedExamTitle("");
        return;
      }

      try {
        setResultsLoading(true);

        if (selectedExamId === "all") {
          const responses = await Promise.all(
            filteredExams.map(async (exam) => {
              const response = await teacherExamApi.getExamResults(exam.id);
              return { exam, response };
            })
          );

          const combinedResults = responses.flatMap(({ exam, response }) =>
            response.success
              ? response.results.map((result) => ({
                  ...result,
                  examTitle: response.exam_title || exam.title,
                  examCode: exam.exam_code,
                  examLevel: exam.level,
                  examTrade: exam.trade,
                }))
              : []
          );

          const totalSubmissions = combinedResults.length;
          const passCount = combinedResults.filter((result) => result.percentage >= 50).length;
          const failCount = totalSubmissions - passCount;
          const averageScore =
            totalSubmissions > 0
              ? Math.round(combinedResults.reduce((sum, result) => sum + result.percentage, 0) / totalSubmissions)
              : 0;

          setResults(combinedResults);
          setStats({
            total_submissions: totalSubmissions,
            pass_count: passCount,
            fail_count: failCount,
            winning_rate: totalSubmissions > 0 ? Math.round((passCount / totalSubmissions) * 100) : 0,
            average_score: averageScore,
          });
          setSelectedExamTitle("Filtered Exam Results");
          return;
        }

        const exam = filteredExams.find((item) => item.id === selectedExamId) || null;
        const response = await teacherExamApi.getExamResults(selectedExamId);

        if (response.success) {
          setResults(
            response.results.map((result) => ({
              ...result,
              examTitle: response.exam_title,
              examCode: exam?.exam_code,
              examLevel: exam?.level,
              examTrade: exam?.trade,
            }))
          );
          setStats(response.stats || null);
          setSelectedExamTitle(response.exam_title);
        }
      } catch (error: any) {
        toast({
          title: "Failed to load exam results",
          description: error?.message || "Please try again.",
          variant: "destructive",
        });
      } finally {
        setResultsLoading(false);
      }
    };

    loadResults();
  }, [filteredExams, selectedExamId, toast]);

  const rankedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
    });
  }, [results]);

  const selectedExam = useMemo(
    () => filteredExams.find((exam) => exam.id === selectedExamId) || null,
    [filteredExams, selectedExamId]
  );

  const downloadCsv = () => {
    if (rankedResults.length === 0) {
      toast({
        title: "No results to export",
        description: "Students need to take the selected exam before you can download the CSV.",
        variant: "destructive",
      });
      return;
    }

    const rows = [
      [
        "Rank",
        "Exam",
        "Exam Code",
        "Trade",
        "Level",
        "Student Name",
        "Username",
        "Score",
        "Total Marks",
        "Percentage",
        "Grade",
        "Submitted At",
      ],
      ...rankedResults.map((result, index) => [
        String(index + 1),
        result.examTitle || "",
        result.examCode || "",
        result.examTrade || "",
        result.examLevel || "",
        result.full_name || "",
        result.username || "",
        String(result.score),
        String(result.total_marks),
        `${result.percentage}%`,
        result.grade || "",
        new Date(result.submitted_at).toLocaleString(),
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedExamTitle || "exam-results"}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

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
    <TeacherLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Results & Analytics</h1>
            <p className="text-muted-foreground">
              Choose the trade, level, and exam you want to see, then download the marks as CSV.
            </p>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
            </CardContent>
          </Card>
        ) : exams.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              No exams created yet. Create an exam first to see results and analytics.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-school-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Filter className="h-5 w-5 text-school-primary" />
                  Result Filters
                </CardTitle>
                <CardDescription>
                  Pick the trade, level, and exam/subject you want to use for viewing marks and downloading results.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Trade</p>
                  <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose trade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All trades</SelectItem>
                      {allowedTrades.map((trade) => (
                        <SelectItem key={trade} value={trade}>
                          {trade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Level</p>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {allowedLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.replace("L", "Level ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Exam / Subject</p>
                  <Select
                    value={selectedExamId}
                    onValueChange={setSelectedExamId}
                    disabled={filteredExams.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={filteredExams.length === 0 ? "No exams in this class" : "Choose exam"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All exams in this class</SelectItem>
                      {filteredExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {formatExamLabel(exam).primary}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedExam && selectedExamId !== "all" ? (
                    <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      <div className="font-medium text-foreground">{formatExamLabel(selectedExam).primary}</div>
                      <div>{formatExamLabel(selectedExam).secondary}</div>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-school-primary/20 bg-gradient-to-br from-school-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Selected Exam
                  </CardDescription>
                  <CardTitle className="text-xl">{selectedExamTitle || selectedExam?.title || "Exam"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {selectedExamId === "all"
                      ? `${filteredExams.length} exam${filteredExams.length === 1 ? "" : "s"} included`
                      : `${selectedExam?.trade || "General"} • ${selectedExam?.level || "N/A"}`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Submissions
                  </CardDescription>
                  <CardTitle className="text-3xl">{stats?.total_submissions ?? 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">Students who have taken this exam</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Average Score
                  </CardDescription>
                  <CardTitle className="text-3xl">{stats?.average_score ?? 0}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">Overall exam performance</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Winning Rate
                  </CardDescription>
                  <CardTitle className="text-3xl">{stats?.winning_rate ?? 0}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">Students scoring 50% and above</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-school-primary/20 bg-gradient-to-r from-school-primary/5 via-background to-school-accent/10">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-school-primary">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Ranked Result List</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Students are listed from first to last by score so you can immediately see how they performed.
                  </p>
                </div>
                <Button onClick={downloadCsv} disabled={rankedResults.length === 0} className="md:min-w-48">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Exam Results</CardTitle>
                  <CardDescription>
                    {resultsLoading
                      ? "Loading results..."
                      : `${rankedResults.length} student result${rankedResults.length === 1 ? "" : "s"} for this exam`}
                  </CardDescription>
                </div>
                {rankedResults.length > 0 ? (
                  <Badge variant="outline" className="px-3 py-1">
                    Ranked from 1st to last
                  </Badge>
                ) : null}
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
                  </div>
                ) : filteredExams.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No exams found for the selected trade and level.
                  </div>
                ) : rankedResults.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No students have taken this exam yet.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Place</TableHead>
                          <TableHead>Exam</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Submitted At</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rankedResults.map((result, index) => (
                          <TableRow key={result.id}>
                            <TableCell>
                              <div className="flex items-center gap-2 font-semibold">
                                {index === 0 ? <Medal className="h-4 w-4 text-yellow-500" /> : null}
                                #{index + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{result.examTitle}</div>
                                <div className="text-xs text-muted-foreground">
                                  {result.examTrade || "General"} • {result.examLevel || "N/A"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{result.full_name}</TableCell>
                            <TableCell className="text-muted-foreground">{result.username}</TableCell>
                            <TableCell>{new Date(result.submitted_at).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono">
                              {result.score} / {result.total_marks}
                            </TableCell>
                            <TableCell className="text-right font-mono">{result.percentage}%</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className={getGradeColor(result.grade)}>
                                {result.grade}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </TeacherLayout>
  );
}
