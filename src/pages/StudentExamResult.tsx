import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { examApi, ExamResultAnswer, ExamResultResponse, studentAuthApi } from "@/services/api";
import { Loader2, Trophy, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from "lucide-react";

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
        const response = await examApi.getResult(student.id, Number(examId));
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
        <section className="py-16 px-4">
          <div className="container mx-auto flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
          </div>
        </section>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl space-y-6 text-center">
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Result unavailable</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate(-1)} className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
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
  const totalMarks = exam.total_marks || answers.reduce((sum, row) => sum + row.marks, 0);
  const scorePercentage = totalMarks > 0 ? Math.round((result.score / totalMarks) * 100) : 0;

  return (
    <StudentLayout>
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-2">
            <Badge className="bg-school-primary/10 text-school-primary dark:bg-school-accent/10 dark:text-school-accent">
              Exam Result
            </Badge>
            <h1 className="text-3xl font-bold gradient-text">{exam.title}</h1>
            <p className="text-muted-foreground">Review your score and question-by-question feedback below.</p>
          </div>

          <Card className="bg-gradient-to-br from-school-primary/10 via-background to-background shadow-xl border-school-primary/20">
            <CardHeader className="text-center space-y-3">
              <Trophy className="w-10 h-10 text-school-primary mx-auto" />
              <CardTitle className="text-4xl font-semibold">
                {result.score} / {totalMarks}
              </CardTitle>
              <CardDescription className="text-base">
                {scorePercentage}% • Grade: <span className="text-school-primary font-bold">{result.grade || 'N/A'}</span> • Submitted on {new Date(result.submitted_at).toLocaleString()}
              </CardDescription>
              {transientState?.fromSubmission && (
                <Badge variant="secondary" className="mx-auto">
                  Answers graded instantly!
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="default">
                <Link to="/student/exams">Back to exams</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/student/exams/${examId}`}>Retake exam</Link>
              </Button>
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
                <ArrowLeft className="w-4 h-4" />
                Back to dashboard
              </Link>
            </Button>
            <Button asChild className="flex items-center gap-2">
              <Link to={`/student/exams/${examId}`}>
                <RotateCcw className="w-4 h-4" />
                Try again
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
      className={`rounded-lg border p-4 transition ${answer.isCorrect
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
        <p className="font-semibold text-lg">{answer.questionText}</p>
        <div className="flex items-center gap-2 text-sm">
          {answer.isCorrect ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-destructive" />
          )}
          <span className={answer.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}>
            {answer.isCorrect ? "Correct" : "Incorrect"}
          </span>
        </div>
        <div className="text-sm space-y-1">
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

