import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  PlusCircle,
  NotebookPen,
  Copy,
  Trash2,
  Edit,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import { teacherExamApi, ExamSummary, ExamDetail, ExamQuestionManage, teacherAuthApi } from "@/services/api";

export default function TeacherExams() {
  const { toast } = useToast();
  const [teacher, setTeacher] = useState<{ trade: string } | null>(null);

  // Exams List State
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  // Exam Creation State
  const [creatingExam, setCreatingExam] = useState(false);
  const [editingExamId, setEditingExamId] = useState<number | null>(null);
  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    total_marks: 100,
    exam_code: "",
    level: "L3" as "L3" | "L4" | "L5",
    trade: "",
  });

  // Selected Exam Details State
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [examDetail, setExamDetail] = useState<ExamDetail | null>(null);
  const [questions, setQuestions] = useState<ExamQuestionManage[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Question Form State
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    type: "MCQ" as "MCQ" | "TF",
    options: ["", "", "", ""] as string[],
    correct_answer: "",
    marks: 1,
    time_limit: 30,
  });

  // Fetch Teacher and Exams on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const teacherData = teacherAuthApi.getStoredTeacher();
        if (teacherData) {
          setTeacher({ trade: teacherData.trade });
          setExamForm(prev => ({ ...prev, trade: teacherData.trade }));
        }

        const response = await teacherExamApi.list();
        if (response.success) {
          setExams(response.exams);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exams",
          variant: "destructive",
        });
      } finally {
        setLoadingExams(false);
      }
    };

    fetchInitialData();
  }, [toast]);

  // Handle Exam Selection
  const selectExam = async (examId: number) => {
    try {
      setSelectedExamId(examId);
      setLoadingQuestions(true);
      setExamDetail(null);
      setQuestions([]);
      resetQuestionForm();

      const response = await teacherExamApi.getManageDetail(examId);
      if (response.success) {
        setExamDetail(response.exam);
        setQuestions(response.questions);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load exam details",
        variant: "destructive",
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Handle Exam Creation or Update
  const handleExamCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.title || !examForm.trade) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingExam(true);

      if (editingExamId) {
        // Update existing exam
        const response: any = await teacherExamApi.update(editingExamId, examForm);
        if (response.success) {
          toast({ title: "Success", description: "Exam updated successfully" });
          // Update list
          setExams(exams.map(ex => ex.id === editingExamId ? response.exam : ex));
          // Reset
          setEditingExamId(null);
          setExamForm(prev => ({
            title: "",
            description: "",
            total_marks: 100,
            exam_code: "",
            level: "L3",
            trade: prev.trade,
          }));
        }
      } else {
        // Create new exam
        const response = await teacherExamApi.create({
          ...examForm,
          exam_code: examForm.exam_code || undefined,
        });

        if (response.success) {
          toast({
            title: "Success",
            description: "Exam created successfully",
          });
          setExams([response.exam, ...exams]);
          // Reset form but keep trade
          setExamForm(prev => ({
            title: "",
            description: "",
            total_marks: 100,
            exam_code: "",
            level: "L3",
            trade: prev.trade, // Keep trade as it likely won't change often
          }));
          // Select the new exam
          if (response.exam.id) {
            selectExam(response.exam.id);
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save exam",
        variant: "destructive",
      });
    } finally {
      setCreatingExam(false);
    }
  };

  const handleEditExam = (exam: ExamSummary) => {
    setEditingExamId(exam.id);
    setExamForm({
      title: exam.title,
      description: exam.description || "",
      total_marks: exam.total_marks,
      exam_code: exam.exam_code || "",
      level: (exam.level as any) || "L3",
      trade: exam.trade || "",
    });
  };

  const handleCancelEditExam = () => {
    setEditingExamId(null);
    setExamForm(prev => ({
      title: "",
      description: "",
      total_marks: 100,
      exam_code: "",
      level: "L3",
      trade: teacher?.trade || prev.trade,
    }));
  };

  const handleDeleteExam = async (examId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent selecting the exam
    if (!confirm("Are you sure you want to delete this exam? This action cannot be undone and will delete all questions within it.")) return;

    try {
      await teacherExamApi.delete(examId);
      setExams(exams.filter(ex => ex.id !== examId));
      if (selectedExamId === examId) {
        setSelectedExamId(null);
        setExamDetail(null);
        setQuestions([]);
      }
      toast({ title: "Success", description: "Exam deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete exam", variant: "destructive" });
    }
  };

  // Reset Question Form
  const resetQuestionForm = () => {
    setEditingQuestionId(null);
    setQuestionForm({
      question_text: "",
      type: "MCQ",
      options: ["", "", "", ""],
      correct_answer: "",
      marks: 1,
      time_limit: 30,
    });
  };

  // Handle Question Edit Setup
  const handleEditQuestion = (question: ExamQuestionManage) => {
    setEditingQuestionId(question.id);
    setQuestionForm({
      question_text: question.question_text,
      type: question.type,
      options: question.type === "MCQ" ? [...question.options] : ["", "", "", ""],
      correct_answer: question.correct_answer,
      marks: question.marks,
      time_limit: question.time_limit || 30,
    });
  };

  // Handle Question Submit (Add or Update)
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;

    if (!questionForm.question_text || !questionForm.correct_answer) {
      toast({
        title: "Validation Error",
        description: "Please fill in question text and correct answer",
        variant: "destructive",
      });
      return;
    }

    // specific validation for MCQ
    if (questionForm.type === "MCQ") {
      const validOptions = questionForm.options.filter(opt => opt.trim() !== "");
      if (validOptions.length < 2) {
        toast({
          title: "Validation Error",
          description: "MCQ must have at least 2 options",
          variant: "destructive",
        });
        return;
      }
      if (!validOptions.includes(questionForm.correct_answer)) {
        toast({
          title: "Validation Error",
          description: "Correct answer must match one of the options exactly",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setSavingQuestion(true);

      const payload = {
        question_text: questionForm.question_text,
        type: questionForm.type,
        options: questionForm.type === "MCQ" ? questionForm.options.filter(o => o) : undefined,
        correct_answer: questionForm.correct_answer,
        marks: questionForm.marks,
        time_limit: questionForm.time_limit,
      };

      let resultQuestion: ExamQuestionManage;

      if (editingQuestionId) {
        const response: any = await teacherExamApi.updateQuestion(editingQuestionId, payload);
        // Assuming the API returns { success: true, question: ... }
        if (response.success) {
          resultQuestion = response.question;
          setQuestions(questions.map(q => q.id === editingQuestionId ? resultQuestion : q));
          toast({ title: "Success", description: "Question updated" });
          resetQuestionForm();
        }
      } else {
        const response: any = await teacherExamApi.addQuestion(selectedExamId, payload);
        if (response.success) {
          resultQuestion = response.question;
          setQuestions([...questions, resultQuestion]);
          toast({ title: "Success", description: "Question added" });
          // We might want to keep the form open or reset it? Let's reset for now
          resetQuestionForm();
        }
      }

      // Update exam detail question count/marks if returned or just manually update local state if needed
      // For now, we rely on the list refresh for total marks, but inside the view we just show questions.

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save question",
        variant: "destructive",
      });
    } finally {
      setSavingQuestion(false);
    }
  };

  // Handle Question Delete
  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await teacherExamApi.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
      toast({
        title: "Success",
        description: "Question deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const copyExamCode = () => {
    if (examDetail?.exam_code) {
      navigator.clipboard.writeText(examDetail.exam_code);
      toast({ title: "Copied", description: "Exam code copied to clipboard" });
    }
  };

  return (
    <TeacherLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Teacher Exams</h1>
          <p className="text-muted-foreground">Prepare and manage online assessments</p>
          {teacher?.trade && (
            <p className="text-sm text-muted-foreground">Linked trade: {teacher.trade}. Students in this trade will see your exams.</p>
          )}
        </div>


        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <NotebookPen className="w-5 h-5 text-school-primary" />
                  {editingExamId ? "Edit Exam" : "Create or select an exam"}
                </div>
                {editingExamId && (
                  <Button variant="ghost" size="sm" onClick={handleCancelEditExam}>
                    Cancel
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                {editingExamId ? "Update exam details." : "Generate an exam code automatically or choose your own."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleExamCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Exam title</label>
                  <Input
                    value={examForm.title}
                    onChange={(event) => setExamForm((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="e.g. Software Development Mock Test"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <Textarea
                    value={examForm.description}
                    onChange={(event) => setExamForm((prev) => ({ ...prev, description: event.target.value }))}
                    placeholder="Optional overview for students"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Total marks</label>
                    <Input
                      type="number"
                      min={0}
                      value={examForm.total_marks}
                      onChange={(event) => setExamForm((prev) => ({ ...prev, total_marks: Number(event.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Custom exam code (optional)</label>
                    <Input
                      value={examForm.exam_code}
                      onChange={(event) => setExamForm((prev) => ({ ...prev, exam_code: event.target.value.toUpperCase() }))}
                      placeholder="EX-ABC123"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Level</label>
                    <select
                      value={examForm.level}
                      onChange={(event) => setExamForm(prev => ({
                        ...prev,
                        level: event.target.value as 'L3' | 'L4' | 'L5'
                      }))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="L3">Level 3</option>
                      <option value="L4">Level 4</option>
                      <option value="L5">Level 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Trade</label>
                    <Input
                      value={examForm.trade}
                      onChange={(event) => setExamForm(prev => ({ ...prev, trade: event.target.value }))}
                      placeholder="Enter trade name"
                      required
                      disabled={!!teacher?.trade}
                      className={teacher?.trade ? "bg-muted text-muted-foreground" : ""}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={creatingExam}>
                  {creatingExam ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {editingExamId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingExamId ? <Edit className="w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                      {editingExamId ? "Update exam" : "Create exam"}
                    </>
                  )}
                </Button>
              </form>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Your exams</h3>
                {loadingExams ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading exams...
                  </div>
                ) : exams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No exams yet. Create one to get started.</p>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                    {exams.map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => selectExam(exam.id)}
                        className={`w-full text-left border rounded-lg p-4 transition ${selectedExamId === exam.id
                          ? "border-school-primary bg-school-primary/5"
                          : "border-border hover:border-school-primary/60"
                          }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{exam.title}</div>
                            {exam.exam_code && (
                              <Badge variant="outline" className="text-xs">
                                {exam.exam_code}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {exam.trade || 'No Trade'}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {exam.level || 'No Level'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {exam.question_count ?? 0} questions • {exam.total_marks} marks
                            </p>
                          </div>
                          <div className="flex gap-1" >
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View Results" asChild onClick={(e) => e.stopPropagation()}>
                              <Link to={`/teacher/exams/${exam.id}/results`}>
                                <BarChart3 className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleEditExam(exam); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => handleDeleteExam(exam.id, e)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Exam questions</CardTitle>
              <CardDescription>
                {examDetail ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span>{examDetail.title}</span>
                      {examDetail.exam_code && (
                        <button
                          type="button"
                          onClick={copyExamCode}
                          className="inline-flex items-center gap-1 text-xs text-school-primary hover:underline"
                        >
                          <Copy className="w-3 h-3" />
                          {examDetail.exam_code}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {examDetail.trade && (
                        <Badge variant="secondary" className="text-xs">
                          {examDetail.trade}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {examDetail.level}
                      </Badge>
                      {examDetail.teacher_name && (
                        <span className="text-xs text-muted-foreground">
                          by {examDetail.teacher_name}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  "Select an exam to view and edit questions."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingQuestions ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Loading questions...
                </div>
              ) : examDetail ? (
                <>
                  <form className="space-y-4" onSubmit={handleQuestionSubmit}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {editingQuestionId ? "Edit question" : "Add new question"}
                      </h3>
                      {editingQuestionId && (
                        <Button variant="ghost" size="sm" onClick={resetQuestionForm}>
                          Cancel edit
                        </Button>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Question text</label>
                      <Textarea
                        value={questionForm.question_text}
                        onChange={(event) =>
                          setQuestionForm((prev) => ({ ...prev, question_text: event.target.value }))
                        }
                        required
                        placeholder="Enter the question"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">Question type</label>
                        <select
                          value={questionForm.type}
                          onChange={(event) => {
                            const newType = event.target.value as "MCQ" | "TF";
                            setQuestionForm((prev) => ({
                              ...prev,
                              type: newType,
                              correct_answer: newType === "TF" ? "True" : prev.correct_answer,
                            }));
                          }}
                          className="w-full rounded-md border border-border bg-background px-3 py-2"
                        >
                          <option value="MCQ">Multiple choice</option>
                          <option value="TF">True / False</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Marks</label>
                        <Input
                          type="number"
                          min={1}
                          value={questionForm.marks}
                          onChange={(event) =>
                            setQuestionForm((prev) => ({ ...prev, marks: Number(event.target.value) }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Time Limit (sec)</label>
                        <Input
                          type="number"
                          min={5}
                          value={questionForm.time_limit}
                          onChange={(event) =>
                            setQuestionForm((prev) => ({ ...prev, time_limit: Number(event.target.value) }))
                          }
                        />
                      </div>
                    </div>
                    {questionForm.type === "MCQ" ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Options</label>
                        {questionForm.options.map((option, index) => (
                          <Input
                            key={index}
                            value={option}
                            placeholder={`Option ${index + 1}`}
                            onChange={(event) => {
                              const newOptions = [...questionForm.options];
                              newOptions[index] = event.target.value;
                              setQuestionForm((prev) => ({ ...prev, options: newOptions }));
                            }}
                          />
                        ))}
                        <label className="text-sm font-medium block mt-2">Correct answer</label>
                        <select
                          value={questionForm.correct_answer}
                          onChange={(event) =>
                            setQuestionForm((prev) => ({ ...prev, correct_answer: event.target.value }))
                          }
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select the correct option</option>
                          {questionForm.options.map((option, index) => (
                            option.trim() !== "" && (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            )
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium block mb-1">Correct answer</label>
                        <select
                          value={questionForm.correct_answer || "True"}
                          onChange={(event) =>
                            setQuestionForm((prev) => ({ ...prev, correct_answer: event.target.value }))
                          }
                          className="w-full rounded-md border border-border bg-background px-3 py-2"
                        >
                          <option value="True">True</option>
                          <option value="False">False</option>
                        </select>
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={savingQuestion}>
                      {savingQuestion ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : editingQuestionId ? (
                        "Update question"
                      ) : (
                        "Add question"
                      )}
                    </Button>
                  </form>

                  <Separator />

                  <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
                    {questions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No questions yet. Add one above.</p>
                    ) : (
                      questions.map((question) => (
                        <div key={question.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold">{question.question_text}</p>
                              <p className="text-xs text-muted-foreground">
                                {question.type === "MCQ" ? "Multiple choice" : "True / False"} • {question.marks} marks • {question.time_limit || 30}s
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(question)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(question.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {question.type === "MCQ" ? (
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {question.options.map((option) => (
                                <li key={option} className="flex items-center gap-2">
                                  {option}
                                  {option === question.correct_answer && (
                                    <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Correct
                                    </Badge>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm">
                              Correct answer:{" "}
                              <Badge variant="outline" className="ml-2">
                                {question.correct_answer}
                              </Badge>
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select an exam to begin editing questions.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}

