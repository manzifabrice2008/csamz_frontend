import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { studentAdminApi, StudentUser } from "@/services/api";
import { Loader2, Trash2, RefreshCw, Users, UserX, UserCheck } from "lucide-react";

export default function AdminStudents() {
    const { toast } = useToast();
    const [students, setStudents] = useState<StudentUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAdminApi.list();
            if (response.success) {
                setStudents(response.students);
            }
        } catch (error: any) {
            toast({
                title: "Failed to load students",
                description: error?.message || "Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleStatusToggle = async (studentId: number, currentStatus: string) => {
        try {
            setActionLoadingId(studentId);
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const response = await studentAdminApi.updateStatus(studentId, newStatus);

            if (response.success) {
                toast({
                    title: "Success",
                    description: `Student marked as ${newStatus}.`,
                });
                setStudents(students.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
            }
        } catch (error: any) {
            toast({
                title: "Update failed",
                description: error?.message || "Please try again.",
                variant: "destructive",
            });
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDelete = async (studentId: number) => {
        if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;

        try {
            setActionLoadingId(studentId);
            const response = await studentAdminApi.delete(studentId);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Student deleted successfully.",
                });
                setStudents(students.filter(s => s.id !== studentId));
            }
        } catch (error: any) {
            toast({
                title: "Delete failed",
                description: error?.message || "Please try again.",
                variant: "destructive",
            });
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <AdminLayout>
            <section className="p-6">
                <div className="container mx-auto max-w-6xl space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Users className="w-6 h-6 text-school-primary dark:text-school-accent" />
                                    Student Management
                                </CardTitle>
                                <CardDescription>View and manage all registered students.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchStudents} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                Refresh List
                            </Button>
                        </CardHeader>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Registered Students</CardTitle>
                            <CardDescription>Manage student access and accounts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-school-primary" />
                                </div>
                            ) : students.length === 0 ? (
                                <div className="text-center text-muted-foreground py-12">No students registered yet.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Trade & Level</TableHead>
                                                <TableHead>Contact Info</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell>
                                                        <div className="font-semibold">{student.full_name}</div>
                                                        <div className="text-xs text-muted-foreground">@{student.username}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{student.trade || "N/A"}</div>
                                                        <Badge variant="secondary" className="text-[10px] h-4">
                                                            {student.level || "N/A"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{student.email || "No email"}</div>
                                                        <div className="text-xs text-muted-foreground">{student.phone_number || "No phone"}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={student.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                                                            {student.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className={student.status === "active" ? "text-amber-600 border-amber-200" : "text-emerald-600 border-emerald-200"}
                                                                onClick={() => handleStatusToggle(student.id, student.status || "active")}
                                                                disabled={actionLoadingId === student.id}
                                                            >
                                                                {actionLoadingId === student.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    student.status === "active" ? (
                                                                        <>
                                                                            <UserX className="w-4 h-4 mr-1" />
                                                                            Deactivate
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <UserCheck className="w-4 h-4 mr-1" />
                                                                            Activate
                                                                        </>
                                                                    )
                                                                )}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-rose-600 border-rose-200"
                                                                onClick={() => handleDelete(student.id)}
                                                                disabled={actionLoadingId === student.id}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-1" />
                                                                Delete
                                                            </Button>
                                                        </div>
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
            </section>
        </AdminLayout>
    );
}
