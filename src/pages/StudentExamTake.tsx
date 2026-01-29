import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { examApi, ExamDetail, ExamQuestion, SubmitExamPayload } from "@/services/api";
import { Loader2, ArrowLeft, AlertCircle, Trophy, Clock, ChevronRight } from "lucide-react";

export default function StudentExamTake() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // New Step-by-step and Timer state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    const loadExam = async () => {
      if (!examId) {
        setError("Invalid exam id.");
        setLoading(false);
        return;
      }

      try {
        const response = await examApi.getQuestions(Number(examId));
        setExam(response.exam);
        setQuestions(response.questions);
      } catch (err: any) {
        setError(err?.message || "Failed to load exam questions.");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  // Final Submit function (reusable)
  const performSubmit = useCallback(async (finalAnswers: Record<number, string>) => {
    if (!examId) return;

    setSubmitting(true);
    setError(null);

    const payload: SubmitExamPayload = {
      answers: Object.entries(finalAnswers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer,
      })),
    };

    try {
      const response = await examApi.submitAnswers(Number(examId), payload);
      navigate(`/student/exams/${examId}/result`, {
        state: {
          fromSubmission: true,
          score: response.score,
          totalMarks: response.total_marks,
        },
        replace: true,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to submit exam. Please try again.");
      setSubmitting(false);
    }
  }, [examId, navigate]);

  // Handle Next / Auto-Advance
  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      performSubmit(answers);
    }
  }, [currentIndex, questions.length, performSubmit, answers]);

  // Timer Effect
  useEffect(() => {
    if (!examStarted || submitting || timeLeft === null) return;

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [examStarted, timeLeft, handleNext, submitting]);

  // Set timeLeft when currentIndex changes
  useEffect(() => {
    if (examStarted && currentQuestion) {
      setTimeLeft(currentQuestion.time_limit || 30);
    }
  }, [currentIndex, currentQuestion, examStarted]);

  const startExam = () => {
    setExamStarted(true);
    if (questions.length > 0) {
      setTimeLeft(questions[0].time_limit || 30);
    }
  };

  const handleOptionChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) {
    return (
      <StudentLayout>
        <section className="py-8 px-4">
          <div className="container mx-auto flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-school-primary" aria-label="Loading exam" />
          </div>
        </section>
      </StudentLayout>
    );
  }

  if (exam?.already_taken) {
    return (
      <StudentLayout>
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="border-school-primary/30">
              <CardHeader className="space-y-3 text-center">
                <CardTitle className="text-school-primary flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Exam Already Completed
                </CardTitle>
                <CardDescription>
                  You have already submitted this exam and cannot retake it.
                </CardDescription>
                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={() => navigate("/student/exams")}>
                    Back to Catalog
                  </Button>
                  <Button onClick={() => navigate(`/student/exams/${examId}/result`)}>
                    View Your Result
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </section>
      </StudentLayout>
    );
  }

  if (error && !submitting) {
    return (
      <StudentLayout>
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="border-destructive/30">
              <CardHeader className="space-y-3 text-center">
                <CardTitle className="text-destructive flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Unable to load exam
                </CardTitle>
                <CardDescription>{error}</CardDescription>
                <Button variant="outline" onClick={() => navigate(-1)} className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Go back
                </Button>
              </CardHeader>
            </Card>
          </div>
        </section>
      </StudentLayout>
    );
  }

  if (!exam) return null;

  if (!examStarted) {
    return (
      <StudentLayout>
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-2xl space-y-8">
            <Card className="border-school-primary/20 shadow-xl overflow-hidden">
              <div className="h-2 bg-school-primary" />
              <CardHeader className="text-center space-y-4">
                <Badge className="w-fit mx-auto bg-school-primary/10 text-school-primary uppercase tracking-wider px-3">
                  Timed Examination
                </Badge>
                <CardTitle className="text-3xl font-bold">{exam.title}</CardTitle>
                {exam.description && <CardDescription className="text-base">{exam.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Total Questions</p>
                    <p className="text-2xl font-bold">{questions.length}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Passing Grade</p>
                    <p className="text-2xl font-bold">50%</p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    Instructions:
                  </p>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 list-disc pl-5 space-y-1">
                    <li>Each question has a individual time limit.</li>
                    <li>The system will auto-advance once time is up.</li>
                    <li>You cannot return to previous questions.</li>
                    <li>Unanswered questions will receive 0 marks.</li>
                  </ul>
                </div>

                <div className="flex justify-center pt-4">
                  <Button size="lg" className="w-full sm:w-auto px-12 h-12 text-lg shadow-lg" onClick={startExam}>
                    Start Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </StudentLayout>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <StudentLayout>
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{exam.title}</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${(timeLeft || 0) <= 10 ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "bg-muted border-border"
              }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold text-lg">{timeLeft}s</span>
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <Card className="border-school-primary/20 shadow-lg">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-primary border-primary/30">
                    {currentQuestion?.marks} mark{currentQuestion?.marks === 1 ? "" : "s"}
                  </Badge>
                </div>
                <h3 className="text-2xl font-semibold leading-tight">
                  {currentQuestion?.question_text}
                </h3>
              </div>

              <div className="grid gap-3">
                {(currentQuestion?.type === "TF" ? ["True", "False"] : currentQuestion?.options).map((option) => (
                  <label
                    key={option}
                    className={`group flex items-center gap-4 rounded-xl border-2 px-6 py-4 cursor-pointer transition-all ${answers[currentQuestion.id] === option
                        ? "border-school-primary bg-school-primary/5 dark:border-school-accent dark:bg-school-accent/5 ring-1 ring-school-primary/20"
                        : "border-border hover:border-school-primary/40 hover:bg-muted/50"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleOptionChange(currentQuestion.id, option)}
                      className="h-5 w-5 accent-school-primary"
                    />
                    <span className="text-lg font-medium group-hover:translate-x-1 transition-transform">{option}</span>
                  </label>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Select an answer to proceed.
                </p>
                <Button
                  onClick={handleNext}
                  disabled={submitting}
                  className="px-8 flex items-center gap-2 h-12 text-base font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : currentIndex === questions.length - 1 ? (
                    "Finish Exam"
                  ) : (
                    <>
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </StudentLayout>
  );
}
