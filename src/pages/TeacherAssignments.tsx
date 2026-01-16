import { useEffect, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { teacherAssignmentsApi, API_BASE_URL } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, FileText, Calendar, Download, Users, CheckCircle, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

// Assignment List Component
function AssignmentsList({ onSelectAssignment }: { onSelectAssignment: (id: number) => void }) {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [createOpen, setCreateOpen] = useState(false);

    const fetchAssignments = async () => {
        try {
            const res = await teacherAssignmentsApi.getAll();
            setAssignments(res.assignments);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load assignments", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await teacherAssignmentsApi.create(formData);
            toast({ title: "Success", description: "Assignment created successfully" });
            setCreateOpen(false);
            fetchAssignments();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to create assignment", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
                    <p className="text-muted-foreground">Create and manage assignments for your students.</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Assignment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Assignment</DialogTitle>
                            <DialogDescription>
                                Post a new assignment for your students. Files are optional.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required placeholder="e.g., Weekly Project Report" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" required placeholder="Detailed instructions..." rows={4} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="deadline">Deadline</Label>
                                    <Input id="deadline" name="deadline" type="datetime-local" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="level">Level</Label>
                                    <Select name="level" defaultValue="L1">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L1">Level 1</SelectItem>
                                            <SelectItem value="L2">Level 2</SelectItem>
                                            <SelectItem value="L3">Level 3</SelectItem>
                                            <SelectItem value="L4">Level 4</SelectItem>
                                            <SelectItem value="L5">Level 5</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="file">Attachment (Optional)</Label>
                                <Input id="file" name="file" type="file" />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Assignment</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p>Loading...</p>
                ) : assignments.length === 0 ? (
                    <p className="text-muted-foreground col-span-full text-center py-10">No assignments created yet.</p>
                ) : (
                    assignments.map((assignment) => (
                        <Card key={assignment.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onSelectAssignment(assignment.id)}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline">{assignment.level}</Badge>
                                    {new Date(assignment.deadline) < new Date() && (
                                        <Badge variant="destructive">Closed</Badge>
                                    )}
                                </div>
                                <CardTitle className="mt-2 text-lg line-clamp-1">{assignment.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(new Date(assignment.deadline), 'MMM d')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{assignment.submission_count} Submitted</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-3">
                                <Button variant="ghost" size="sm" className="w-full justify-between group">
                                    View Submissions
                                    <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

// Submissions List & Grading Component
function AssignmentGrading({ assignmentId, onBack }: { assignmentId: number, onBack: () => void }) {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

    const fetchSubmissions = async () => {
        try {
            const res = await teacherAssignmentsApi.getSubmissions(assignmentId);
            setSubmissions(res.submissions);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load submissions", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [assignmentId]);

    const handleGrade = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const grade = Number(formData.get('grade'));
        const feedback = formData.get('feedback') as string;

        try {
            await teacherAssignmentsApi.gradeSubmission(selectedSubmission.id, grade, feedback);
            toast({ title: "Success", description: "Submission graded" });
            setSelectedSubmission(null);
            fetchSubmissions();
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit grade", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={onBack}>
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Assignment Submissions</h2>
                    <p className="text-muted-foreground">Review and grade student work</p>
                </div>
            </div>

            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grade Submission: {selectedSubmission?.full_name}</DialogTitle>
                        <DialogDescription>Enter grade and feedback for this student.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleGrade} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Student File</Label>
                            <div className="flex items-center gap-2 p-2 border rounded text-sm bg-muted/50">
                                <FileText className="h-4 w-4" />
                                <span className="flex-1 truncate">
                                    {selectedSubmission?.file_path?.split(/[/\\]/).pop()}
                                </span>
                                <Button size="icon" variant="ghost" type="button" onClick={() => { const base = API_BASE_URL.replace(/\/api$/, ""); window.open(`${base}/${selectedSubmission?.file_path}`, '_blank'); }}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="grade">Grade (0-100)</Label>
                            <Input id="grade" name="grade" type="number" min="0" max="100" defaultValue={selectedSubmission?.grade} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea id="feedback" name="feedback" rows={3} defaultValue={selectedSubmission?.feedback} placeholder="Good work..." />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setSelectedSubmission(null)}>Cancel</Button>
                            <Button type="submit">Submit Grade</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="border rounded-md">
                <ScrollArea className="h-[600px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
                            ) : submissions.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No submissions yet.</TableCell></TableRow>
                            ) : (
                                submissions.map(sub => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <div className="font-medium">{sub.full_name}</div>
                                            <div className="text-xs text-muted-foreground">{sub.email}</div>
                                        </TableCell>
                                        <TableCell>{format(new Date(sub.submitted_at), 'MMM d, h:mm a')}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => { const base = API_BASE_URL.replace(/\/api$/, ""); window.open(`${base}/${sub.file_path}`, '_blank'); }}>
                                                <FileText className="h-3 w-3" /> View
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {sub.grade !== null ? (
                                                <Badge variant={sub.grade >= 50 ? "default" : "destructive"}>
                                                    {sub.grade}%
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-500 border-orange-200">Pending</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => setSelectedSubmission(sub)}>
                                                {sub.grade !== null ? "Update Grade" : "Grade"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}

export default function TeacherAssignments() {
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

    return (
        <TeacherLayout>
            <div className="p-6">
                {selectedAssignmentId ? (
                    <AssignmentGrading assignmentId={selectedAssignmentId} onBack={() => setSelectedAssignmentId(null)} />
                ) : (
                    <AssignmentsList onSelectAssignment={setSelectedAssignmentId} />
                )}
            </div>
        </TeacherLayout>
    );
}
