import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { examApi, ExamSummary } from "@/services/api";
import { CalendarDays, ClipboardList, Loader2 } from "lucide-react";

export default function StudentExams() {
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await examApi.list();
        setExams(response.exams);
      } catch (err: any) {
        setError(err?.message || "Unable to load exams right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <StudentLayout>
      <section className="py-8 px-4">
        <div className="container mx-auto space-y-6">
          <div className="space-y-2">
            <Badge className="bg-school-primary/10 text-school-primary dark:bg-school-accent/10 dark:text-school-accent">
              Online Exams
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">Available Online Exams</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select an exam to begin. Each exam includes multiple choice or true/false questions and is graded
              automatically once you submit.
            </p>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Exam Catalog</CardTitle>
              <CardDescription>Browse exams published by your instructors.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-school-primary" aria-label="Loading exams" />
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-10">{error}</div>
              ) : exams.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
                  <ClipboardList className="w-10 h-10" />
                  <div>
                    <p className="text-lg font-semibold">No exams available yet</p>
                    <p>Your teachers will publish exams here once they are ready.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {exams.map((exam) => (
                    <Card key={exam.id} className="border shadow-sm flex flex-col">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                        {exam.description && (
                          <CardDescription className="text-sm">{exam.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="text-sm text-muted-foreground space-y-2">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            <span>
                              {exam.question_count || 0} question{(exam.question_count || 0) === 1 ? "" : "s"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Total Marks:</span>
                            <span>{exam.total_marks || 0}</span>
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <Link to={`/student/exams/${exam.id}`}>Start Exam</Link>
                        </Button>
                      </CardContent>
                    </Card>
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

