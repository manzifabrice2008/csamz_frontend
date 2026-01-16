import { useEffect, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { teacherStudentsApi, teacherAttendanceApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check, X, Clock, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface StudentForAttendance {
    id: number;
    full_name: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks: string;
}

export default function TeacherAttendance() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [students, setStudents] = useState<StudentForAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Get all students
                const studentsRes = await teacherStudentsApi.getAll();

                // 2. Get existing attendance for the selected date
                let existingAttendance: any[] = [];
                if (date) {
                    try {
                        const historyRes = await teacherAttendanceApi.getHistory({ date: format(date, 'yyyy-MM-dd') });
                        existingAttendance = historyRes.attendance;
                    } catch (e) {
                        console.warn("No existing attendance found or error fetching", e);
                    }
                }

                // 3. Merge data
                const merged = studentsRes.students.map(s => {
                    const existing = existingAttendance.find((att: any) => att.student_id === s.id);
                    return {
                        id: s.id,
                        full_name: s.full_name,
                        status: existing ? existing.status : 'present', // Default to present
                        remarks: existing ? existing.remarks || '' : ''
                    };
                });

                setStudents(merged);
            } catch (error) {
                toast({ title: "Error", description: "Failed to load students", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [date]);

    const updateStatus = (id: number, status: 'present' | 'absent' | 'late' | 'excused') => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const updateRemarks = (id: number, remarks: string) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, remarks } : s));
    };

    const handleSave = async () => {
        if (!date) return;
        setSaving(true);
        const payload = students.map(s => ({
            student_id: s.id,
            status: s.status,
            remarks: s.remarks
        }));

        try {
            await teacherAttendanceApi.mark(format(date, 'yyyy-MM-dd'), payload);
            toast({ title: "Success", description: "Attendance saved successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save attendance", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <TeacherLayout>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                        <p className="text-muted-foreground">Mark daily attendance for your students.</p>
                    </div>
                    <div className="bg-card border rounded-md p-1 shadow-sm">
                        <span className="px-3 text-sm font-medium">{date ? format(date, 'EEEE, MMMM do, yyyy') : 'Select Date'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle>Select Date</CardTitle>
                            <CardDescription>Choose a date to mark or view attendance.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Student List</CardTitle>
                                <CardDescription>Default status is Present.</CardDescription>
                            </div>
                            <Button onClick={handleSave} disabled={loading || saving}>
                                {saving ? "Saving..." : "Save Attendance"}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Remarks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-8">Loading...</TableCell></TableRow>
                                    ) : students.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No students found.</TableCell></TableRow>
                                    ) : (
                                        students.map(student => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">{student.full_name}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant={student.status === 'present' ? 'default' : 'outline'}
                                                            className={`h-8 w-8 rounded-full ${student.status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                            onClick={() => updateStatus(student.id, 'present')}
                                                            title="Present"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant={student.status === 'absent' ? 'destructive' : 'outline'}
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => updateStatus(student.id, 'absent')}
                                                            title="Absent"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant={student.status === 'late' ? 'default' : 'outline'}
                                                            className={`h-8 w-8 rounded-full ${student.status === 'late' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                                                            onClick={() => updateStatus(student.id, 'late')}
                                                            title="Late"
                                                        >
                                                            <Clock className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant={student.status === 'excused' ? 'secondary' : 'outline'}
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => updateStatus(student.id, 'excused')}
                                                            title="Excused"
                                                        >
                                                            <HelpCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        placeholder="Optional remarks"
                                                        value={student.remarks}
                                                        onChange={(e) => updateRemarks(student.id, e.target.value)}
                                                        className="h-8 text-sm"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TeacherLayout>
    );
}
