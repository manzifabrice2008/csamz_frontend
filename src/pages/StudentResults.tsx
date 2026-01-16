import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarDays, Clock4, Trophy, ChevronRight, FileText } from "lucide-react";
import { examApi, StudentHistoryResult } from "@/services/api";

export default function StudentResults() {
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
        <StudentLayout>
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-5xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
                        <p className="text-muted-foreground mt-2">
                            View your exam history, scores, and grades.
                        </p>
                    </div>

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
