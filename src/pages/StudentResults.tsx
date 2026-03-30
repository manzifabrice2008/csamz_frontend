import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarDays, Clock4, Trophy, ChevronRight, FileText, Medal, BookOpen, Users } from "lucide-react";
import { examApi, StudentClassLeaderboardEntry, StudentClassSubjectSummary, StudentClassSummary, StudentHistoryResult } from "@/services/api";

export default function StudentResults() {
    const [results, setResults] = useState<StudentHistoryResult[]>([]);
    const [summary, setSummary] = useState<StudentClassSummary | null>(null);
    const [subjects, setSubjects] = useState<StudentClassSubjectSummary[]>([]);
    const [leaderboard, setLeaderboard] = useState<StudentClassLeaderboardEntry[]>([]);
    const [hasPublishedGrades, setHasPublishedGrades] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const fetchHistory = async () => {
            try {
                const [historyResponse, classSummaryResponse] = await Promise.all([
                    examApi.getStudentHistory(),
                    examApi.getClassSummary(),
                ]);

                if (!active) {
                    return;
                }

                if (historyResponse.success) {
                    setResults(historyResponse.results);
                }

                if (classSummaryResponse.success) {
                    setHasPublishedGrades(classSummaryResponse.has_published_grades);
                    setSummary(classSummaryResponse.summary);
                    setSubjects(classSummaryResponse.subjects);
                    setLeaderboard(classSummaryResponse.leaderboard);
                }
            } catch (error) {
                console.error("Failed to fetch results", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 15000);

        return () => {
            active = false;
            clearInterval(interval);
        };
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
                <div className="container mx-auto max-w-5xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
                        <p className="text-muted-foreground mt-2">
                            View your exam history, your class performance, and your grades in every subject.
                        </p>
                    </div>

                    {!loading && !hasPublishedGrades ? (
                        <Card className="border-dashed">
                            <CardContent className="pt-6">
                                <p className="font-medium">Class grades are not published yet.</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    You can already see your own scores below. Your teacher needs to confirm and publish the grades before the class leaderboard and other students&apos; grades appear here.
                                </p>
                            </CardContent>
                        </Card>
                    ) : null}

                    {loading ? null : summary ? (
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Trophy className="w-4 h-4" />
                                        Overall Average
                                    </div>
                                    <p className="mt-2 text-3xl font-bold">{summary.student_average}%</p>
                                    <p className="text-xs text-muted-foreground">Across {summary.exams_taken} exam{summary.exams_taken === 1 ? "" : "s"}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        Class Average
                                    </div>
                                    <p className="mt-2 text-3xl font-bold">{summary.class_average}%</p>
                                    <p className="text-xs text-muted-foreground">{summary.trade} - {summary.level}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Medal className="w-4 h-4" />
                                        Class Rank
                                    </div>
                                    <p className="mt-2 text-3xl font-bold">{summary.student_rank ? `#${summary.student_rank}` : "-"}</p>
                                    <p className="text-xs text-muted-foreground">Out of {summary.class_size} students</p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}

                    {!loading && subjects.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-school-primary" />
                                    Subject Performance
                                </CardTitle>
                                <CardDescription>
                                    Your grade average and rank in every subject.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {subjects.map((subject) => (
                                        <div key={subject.subject} className="rounded-lg border p-4 space-y-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <h3 className="font-semibold">{subject.subject}</h3>
                                                <Badge variant="outline">
                                                    {subject.student_rank ? `Rank #${subject.student_rank}` : "No rank"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Your average</span>
                                                <span className="font-semibold">{subject.student_average}%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Class average</span>
                                                <span className="font-semibold">{subject.class_average}%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Exams taken</span>
                                                <span className="font-semibold">{subject.exams_taken}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}

                    {!loading && leaderboard.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Medal className="w-5 h-5 text-school-primary" />
                                    Class Leaderboard
                                </CardTitle>
                                <CardDescription>
                                    Overall class grades across all exams.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {leaderboard.map((entry) => (
                                        <div key={entry.student_id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div>
                                                <p className="font-medium">{entry.full_name}</p>
                                                <p className="text-xs text-muted-foreground">@{entry.username} - {entry.exams_taken} exam{entry.exams_taken === 1 ? "" : "s"}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">#{entry.rank}</p>
                                                <p className="text-sm text-muted-foreground">{entry.average_percentage}% average</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-school-primary" />
                                Exam History
                            </CardTitle>
                            <CardDescription>
                                A complete list of all exams you have taken.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
                                </div>
                            ) : results.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No results found</p>
                                    <p className="mb-6">You haven't taken any exams yet.</p>
                                    <Button asChild>
                                        <Link to="/student/exams">Browse Exams</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {results.map((result) => (
                                        <div
                                            key={result.id}
                                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-lg">{result.examTitle}</h3>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays className="w-3.5 h-3.5" />
                                                        {new Date(result.submittedAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock4 className="w-3.5 h-3.5" />
                                                        {new Date(result.submittedAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 justify-between md:justify-end">
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold font-mono">{result.percentage}%</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {result.score} / {result.totalMarks} points
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Badge className={`${getGradeColor(result.grade)} text-sm px-3 py-1`}>
                                                        Grade {result.grade}
                                                    </Badge>
                                                    <Button asChild variant="ghost" size="icon">
                                                        <Link to={`/student/exams/${result.examId}/result`}>
                                                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
                </div>
            </section>
        </StudentLayout>
    );
}
