import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { examApi, ExamDetail, ExamQuestion, SubmitExamPayload } from "@/services/api";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";

export default function StudentExamTake() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

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

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const handleOptionChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!examId) {
      setError("Invalid exam id.");
      return;
    }

    if (Object.keys(answers).length === 0) {
      setError("Please answer at least one question before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload: SubmitExamPayload = {
      answers: Object.entries(answers).map(([questionId, answer]) => ({
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
    } finally {
      setSubmitting(false);
    }
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

  if (error) {
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

  if (!exam) {
    return null;
  }

  return (
    <StudentLayout>
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="space-y-2 text-center">
            <Badge className="bg-school-primary/10 text-school-primary dark:bg-school-accent/10 dark:text-school-accent">
              Online Exam
            </Badge>
            <h1 className="text-3xl font-bold gradient-text">{exam.title}</h1>
            {exam.description && <p className="text-muted-foreground max-w-2xl mx-auto">{exam.description}</p>}
            <p className="text-sm text-muted-foreground">
              Answer all questions and submit to see your score instantly. Total marks: {exam.total_marks}.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                {questions.length} question{questions.length === 1 ? "" : "s"} • {answeredCount} answered
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
              <form className="space-y-8" onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                  <div key={question.id} className="space-y-4 border border-border/80 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Question {index + 1}</p>
                      <p className="text-lg font-semibold">{question.question_text}</p>
                      <p className="text-xs text-muted-foreground">Worth {question.marks} mark{question.marks === 1 ? "" : "s"}</p>
                    </div>

                    <div className="space-y-2">
                      {(question.type === "TF" ? ["True", "False"] : question.options).map((option) => (
                        <label
                          key={option}
                          className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition ${answers[question.id] === option
                            ? "border-school-primary bg-school-primary/10 dark:border-school-accent dark:bg-school-accent/10"
                            : "border-border hover:border-school-primary/60"
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() => handleOptionChange(question.id, option)}
                            className="h-4 w-4 accent-school-primary"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {error && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="button" variant="ghost" className="flex items-center gap-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to exams
                  </Button>
                  <Button type="submit" className="min-w-[180px]" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Exam"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </StudentLayout>
  );
}

