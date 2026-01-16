import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { teacherStudentsApi } from "@/services/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, BookOpen, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Student {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    trade: string;
    level: string;
    status: string;
    created_at: string;
}

export default function TeacherStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await teacherStudentsApi.getAll();
                if (response.success) {
                    setStudents(response.students);
                    setFilteredStudents(response.students);
                }
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = students.filter(
            (student) =>
                student.full_name.toLowerCase().includes(lowerQuery) ||
                student.email.toLowerCase().includes(lowerQuery) ||
                student.trade.toLowerCase().includes(lowerQuery)
        );
        setFilteredStudents(filtered);
    }, [searchQuery, students]);

    return (
        <TeacherLayout>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
                        <p className="text-muted-foreground">
                            Manage and view students enrolled in your trade.
                        </p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search students..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border rounded-lg bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Trade & Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Loading students...
                                    </TableCell>
                                </TableRow>
                            ) : filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {student.full_name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{student.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">ID: {student.id}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    <span>{student.email}</span>
                                                </div>
                                                {student.phone && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        <span>{student.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <BookOpen className="h-3 w-3 text-muted-foreground" />
                                                    <span>{student.trade}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <GraduationCap className="h-3 w-3 text-muted-foreground" />
                                                    <span>{student.level || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={student.status === "active" ? "default" : "secondary"}
                                                className={
                                                    student.status === "active" ? "bg-green-500 hover:bg-green-600" : ""
                                                }
                                            >
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/teacher/students/${student.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </TeacherLayout>
    );
}
