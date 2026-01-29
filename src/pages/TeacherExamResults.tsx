import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { teacherExamApi, TeacherExamResult } from "@/services/api";
import { ArrowLeft, Loader2, Trophy, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function TeacherExamResults() {
    const { examId } = useParams<{ examId: string }>();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<TeacherExamResult[]>([]);
    const [examTitle, setExamTitle] = useState("");
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!examId) return;
            try {
                const response = await teacherExamApi.getExamResults(Number(examId));
                if (response.success) {
                    setResults(response.results);
                    setExamTitle(response.exam_title);
                    setStats(response.stats);
                }
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to load results",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [examId, toast]);

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
            case 'B': return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case 'C': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        }
    };

    return (
        <TeacherLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/teacher/exams">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Exam Results</h1>
                        <p className="text-muted-foreground">
                            {loading ? "Loading..." : `Viewing results for "${examTitle}"`}
                    </div>
                </div>

                {!loading && stats && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="bg-gradient-to-br from-school-primary/5 to-transparent border-school-primary/20">
                            <CardHeader className="pb-2">
                                <CardDescription>Winning Rate</CardDescription>
                                <CardTitle className="text-3xl font-bold text-school-primary">
                                    {stats.winning_rate}%
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    Percentage of students passed
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Average Score</CardDescription>
                                <CardTitle className="text-3xl font-bold">
                                    {stats.average_score}%
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    Mean performance of class
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Passed</CardDescription>
                                <CardTitle className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {stats.pass_count}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    Students scored above 50%
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Submissions</CardDescription>
                                <CardTitle className="text-3xl font-bold">
                                    {stats.total_submissions}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    Unique student attempts
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Student submissions</CardTitle>
                            <CardDescription>
                                {results.length} result{results.length !== 1 ? "s" : ""} found
                            </CardDescription>
                        </div>
                        {/* Future: Export CSV button could go here */}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
                            </div>
                        ) : results.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No students have taken this exam yet.</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Submitted At</TableHead>
                                            <TableHead className="text-right">Score</TableHead>
                                            <TableHead className="text-right">Percentage</TableHead>
                                            <TableHead className="text-center">Grade</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((result) => (
                                            <TableRow key={result.id}>
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
            </div>
        </TeacherLayout>
    );
}
