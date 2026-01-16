import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentAssignmentsApi, StudentAssignment } from "@/services/api";
import { Loader2, FileText, Upload, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchAssignments = async () => {
        try {
            const response = await studentAssignmentsApi.getAll();
            setAssignments(response.assignments);
        } catch (error) {
            console.error("Failed to load assignments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleSubmit = async (id: number, file: File) => {
        try {
            setSubmitting(id);
            await studentAssignmentsApi.submit(id, file);
            toast({
                title: "Success",
                description: "Assignment submitted successfully!",
            });
            fetchAssignments(); // Refresh to show updated status
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit assignment",
                variant: "destructive",
            });
        } finally {
            setSubmitting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignments.length === 0 ? (
                    <div className="col-span-full text-center py-12 space-y-3">
                        <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-semibold">No assignments found</p>
                        <p className="text-muted-foreground">You're all caught up! No active assignments for your trade.</p>
                    </div>
                ) : (
                    assignments.map((assignment) => {
                        const isSubmitted = !!assignment.submitted_at;
                        const isGraded = assignment.grade !== null && assignment.grade !== undefined;
                        const dueDate = new Date(assignment.deadline);
                        const isOverdue = dueDate < new Date() && !isSubmitted;

                        return (
                            <Card key={assignment.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={isGraded ? "default" : isSubmitted ? "secondary" : "outline"} className={
                                            isGraded ? "bg-green-600 hover:bg-green-700" :
                                                isSubmitted ? "bg-blue-100 text-blue-700 border-none" :
                                                    isOverdue ? "bg-red-100 text-red-700 border-none" : ""
                                        }>
                                            {isGraded ? "Graded" : isSubmitted ? "Submitted" : isOverdue ? "Overdue" : "Pending"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded">
                                            <Calendar className="w-3 h-3" />
                                            {dueDate.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="line-clamp-1">{assignment.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    {assignment.teacher_name && (
                                        <p className="text-sm text-muted-foreground">
                                            Instructor: {assignment.teacher_name}
                                        </p>
                                    )}

                                    {isGraded && (
                                        <div className="p-3 bg-secondary/30 rounded-lg space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Grade</span>
                                                <span className="font-bold text-lg text-green-600">{assignment.grade}</span>
                                            </div>
                                            {assignment.feedback && (
                                                <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                                                    <p className="font-medium text-xs uppercase tracking-wider mb-1">Feedback</p>
                                                    <p className="italic">"{assignment.feedback}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </CardContent>
                                <CardFooter>
                                    <SubmissionDialog
                                        assignment={assignment}
                                        onSubmit={(file) => handleSubmit(assignment.id, file)}
                                        isSubmitting={submitting === assignment.id}
                                    />
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function SubmissionDialog({ assignment, onSubmit, isSubmitting }: {
    assignment: StudentAssignment,
    onSubmit: (file: File) => void,
    isSubmitting: boolean
}) {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const isSubmitted = !!assignment.submitted_at;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            onSubmit(file);
            setOpen(false);
            setFile(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant={isSubmitted ? "outline" : "default"}>
                    {isSubmitted ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {assignment.grade ? "View Feedback" : "Update Submission"}
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Assignment
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{assignment.title}</DialogTitle>
                    <DialogDescription>
                        {isSubmitted ? "Update your submission or view details." : "Upload your work for this assignment."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Description</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {assignment.description}
                        </p>
                    </div>

                    {!assignment.grade && (
                        <div className="space-y-2">
                            <Label htmlFor="file">Upload File</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">PDF, DOCX, IMG up to 10MB</p>
                        </div>
                    )}

                    {assignment.submission_id && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                            <CheckCircle2 className="w-4 h-4" />
                            Submitted on {new Date(assignment.submitted_at!).toLocaleString()}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {!assignment.grade && (
                        <Button onClick={handleSubmit} disabled={!file || isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isSubmitted ? "Update Submission" : "Submit"}
                        </Button>
                    )}
                    {assignment.grade && (
                        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
