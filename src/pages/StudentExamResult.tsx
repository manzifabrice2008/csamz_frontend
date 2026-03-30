import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { examApi, ExamResultAnswer, ExamResultResponse, studentAuthApi } from "@/services/api";
import { Loader2, Trophy, CheckCircle2, XCircle, ArrowLeft, Medal, Users } from "lucide-react";

interface ResultState {
  fromSubmission?: boolean;
  score?: number;
  totalMarks?: number;
}

export default function StudentExamResult() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [resultData, setResultData] = useState<ExamResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const student = useMemo(() => studentAuthApi.getStoredStudent(), []);
  const transientState = (location.state as ResultState | null) || null;

  useEffect(() => {
    const fetchResult = async () => {
      if (!examId) {
        setError("Invalid exam id.");
        setLoading(false);
        return;
      }

      if (!student?.id) {
        navigate("/student/login");
        return;
      }

      try {
        const response = await examApi.getResult(student.id, examId);
        setResultData(response);
      } catch (err: any) {
        setError(err?.message || "Unable to load result.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, navigate, student?.id]);

  if (loading) {
    return (
      <StudentLayout>
        <section className="px-4 py-16">
          <div className="container mx-auto flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
          </div>
        </section>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-3xl space-y-6 text-center">
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Result unavailable</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate(-1)} className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </StudentLayout>
    );
  }

  if (!resultData) {
    return null;
  }

  const { exam, result, answers } = resultData;
  const ranking = resultData.ranking || [];
  const totalMarks = exam.total_marks || answers.reduce((sum, row) => sum + row.marks, 0);
  const scorePercentage = totalMarks > 0 ? Math.round((result.score / totalMarks) * 100) : 0;
  const gradesPublished = Boolean(exam.grades_published);

  return (
    <StudentLayout>
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="space-y-2 text-center">
            <Badge className="bg-school-primary/10 text-school-primary dark:bg-school-accent/10 dark:text-school-accent">
              Exam Result
            </Badge>
            <h1 className="gradient-text text-3xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">Review your score, your place, and the full ranking for this exam.</p>
          </div>

          <Card className="border-school-primary/20 bg-gradient-to-br from-school-primary/10 via-background to-background shadow-xl">
            <CardHeader className="space-y-3 text-center">
              <Trophy className="mx-auto h-10 w-10 text-school-primary" />
              <CardTitle className="text-4xl font-semibold">
                {result.score} / {totalMarks}
              </CardTitle>
              <CardDescription className="text-base">
                {scorePercentage}% - Grade: <span className="font-bold text-school-primary">{result.grade || "N/A"}</span> -
                {" "}Submitted on {new Date(result.submitted_at).toLocaleString()}
              </CardDescription>
              {transientState?.fromSubmission ? (
                <Badge variant="secondary" className="mx-auto">
                  Answers graded instantly!
                </Badge>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-school-primary/20 bg-background/70 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Your Place</p>
                  <p className="mt-2 text-3xl font-bold text-school-primary">{result.rank ? `#${result.rank}` : "-"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {gradesPublished
                      ? "Position among all students who attended this exam"
                      : "Ranking will appear after your teacher publishes the grades"}
                  </p>
                </div>
                <div className="rounded-xl border border-school-primary/20 bg-background/70 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="mt-2 text-3xl font-bold text-school-primary">{result.grade || "N/A"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Your final exam grade</p>
                </div>
                <div className="rounded-xl border border-school-primary/20 bg-background/70 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Students Attended</p>
                  <p className="mt-2 text-3xl font-bold text-school-primary">{gradesPublished ? ranking.length : "-"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {gradesPublished ? "All ranked students in this exam" : "Class details stay hidden until publication"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild variant="default">
                  <Link to="/student/exams">Back to exams Catalog</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-school-primary" />
                Exam Ranking
              </CardTitle>
              <CardDescription>
                {gradesPublished
                  ? "See your place and the rank of all students who attended this exam."
                  : "This ranking will unlock once your teacher publishes the grades."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ranking.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  {gradesPublished ? "No ranking data available for this exam yet." : "Grades have not been published for class viewing yet."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Place</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead>Submitted At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ranking.map((entry) => {
                        const isCurrentStudent = String(entry.student_id) === String(student?.id);

                        return (
                          <TableRow key={`${entry.student_id}-${entry.rank}`} className={isCurrentStudent ? "bg-school-primary/5" : ""}>
                            <TableCell>
                              <div className="flex items-center gap-2 font-semibold">
                                {entry.rank === 1 ? <Medal className="h-4 w-4 text-yellow-500" /> : null}
                                #{entry.rank}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {entry.full_name}
                              {isCurrentStudent ? <Badge variant="secondary" className="ml-2">You</Badge> : null}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{entry.username || "-"}</TableCell>
                            <TableCell className="text-right font-mono">
                              {entry.score} / {entry.total_marks}
                            </TableCell>
                            <TableCell className="text-right font-mono">{entry.percentage}%</TableCell>
                            <TableCell>{new Date(entry.submitted_at).toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Question Feedback</CardTitle>
              <CardDescription>Correct answers are highlighted for your review.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
              {answers.map((answer, index) => (
                <AnswerCard key={answer.questionId} answer={answer} index={index} />
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button asChild variant="ghost" className="flex items-center gap-2">
              <Link to="/student/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </StudentLayout>
  );
}

function AnswerCard({ answer, index }: { answer: ExamResultAnswer; index: number }) {
  const isAnswered = typeof answer.studentAnswer === "string" && answer.studentAnswer.length > 0;

  return (
    <div
      className={`rounded-lg border p-4 transition ${
        answer.isCorrect
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/40 dark:bg-emerald-400/10"
          : "border-destructive/20 bg-destructive/5"
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Question {index + 1}</p>
          <Badge variant="outline" className="font-mono">
            {answer.marksAwarded}/{answer.marks} marks
          </Badge>
        </div>
        <p className="text-lg font-semibold">{answer.questionText}</p>
        <div className="flex items-center gap-2 text-sm">
          {answer.isCorrect ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
          <span className={answer.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}>
            {answer.isCorrect ? "Correct" : "Incorrect"}
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold text-foreground">Your answer:</span>{" "}
            {isAnswered ? answer.studentAnswer : "No answer provided"}
          </p>
          <p>
            <span className="font-semibold text-foreground">Correct answer:</span> {answer.correctAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}
