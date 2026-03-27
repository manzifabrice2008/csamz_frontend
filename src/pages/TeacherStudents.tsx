import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { teacherAuthApi, teacherStudentsApi } from "@/services/api";
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
import { Search, Mail, Phone, BookOpen, Filter, Users, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  trade: string;
  level: string;
  status: string;
  created_at: string;
}

const normalizeTrade = (value?: string | null) => (value || "").trim().toLowerCase();
const normalizeLevel = (value?: string | null) => (value || "").trim().toUpperCase();
const formatLevel = (value?: string | null) => {
  const normalized = normalizeLevel(value);
  if (normalized.startsWith("L")) return normalized.replace(/^L/i, "Level ");
  if (/^\d+$/.test(normalized)) return `Level ${normalized}`;
  if (normalized.startsWith("LEVEL")) return normalized.replace(/^LEVEL\s*/i, "Level ");
  return value || "No Level";
};

export default function TeacherStudents() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrade, setSelectedTrade] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const teacher = teacherAuthApi.getStoredTeacher();

  const allowedTrades = useMemo(
    () => (teacher?.trades?.length ? teacher.trades : teacher?.trade ? [teacher.trade] : []),
    [teacher]
  );

  const allowedLevels = useMemo(
    () => (teacher?.levels?.length ? teacher.levels : teacher?.level ? [teacher.level] : []),
    [teacher]
  );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await teacherStudentsApi.getAll();
        if (response.success) {
          setStudents(response.students);
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
    if (allowedTrades.length > 0 && selectedTrade === "all") {
      setSelectedTrade(allowedTrades[0]);
    }
  }, [allowedTrades, selectedTrade]);

  useEffect(() => {
    if (allowedLevels.length > 0 && selectedLevel === "all") {
      setSelectedLevel(allowedLevels[0]);
    }
  }, [allowedLevels, selectedLevel]);

  const filteredStudents = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();

    return students.filter((student) => {
      const matchesTrade =
        selectedTrade === "all" || normalizeTrade(student.trade) === normalizeTrade(selectedTrade);
      const matchesLevel =
        selectedLevel === "all" || normalizeLevel(student.level) === normalizeLevel(selectedLevel);
      const matchesSearch =
        student.full_name.toLowerCase().includes(lowerQuery) ||
        (student.email || "").toLowerCase().includes(lowerQuery) ||
        student.trade.toLowerCase().includes(lowerQuery) ||
        (student.level || "").toLowerCase().includes(lowerQuery);

      return matchesTrade && matchesLevel && matchesSearch;
    });
  }, [searchQuery, selectedTrade, selectedLevel, students]);

  const studentsByLevel = useMemo(() => {
    return filteredStudents.reduce<Record<string, Student[]>>((groups, student) => {
      const level = student.level || "No Level";
      if (!groups[level]) {
        groups[level] = [];
      }
      groups[level].push(student);
      return groups;
    }, {});
  }, [filteredStudents]);

  const orderedLevels = useMemo(() => {
    const preferredOrder = ["L1", "L2", "L3", "L4", "L5", "No Level"];
    const levels = Object.keys(studentsByLevel);
    return levels.sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [studentsByLevel]);

  const selectedClassLabel = `${selectedTrade === "all" ? "All trades" : selectedTrade} - ${
    selectedLevel === "all" ? "All levels" : formatLevel(selectedLevel)
  }`;

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!window.confirm(`Delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingStudentId(studentId);
      const response = await teacherStudentsApi.delete(studentId);

      if (response.success) {
        setStudents((current) => current.filter((student) => student.id !== studentId));
        toast({
          title: "Student deleted",
          description: `${studentName} was removed successfully.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingStudentId(null);
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
            <p className="text-muted-foreground">
              Choose a trade and class level to see only the students you teach.
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

        <Card className="border-school-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Filter className="h-5 w-5 text-school-primary" />
              Class Navigation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Trade</p>
                <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose trade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All trades</SelectItem>
                    {allowedTrades.map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Class Level</p>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    {allowedLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {formatLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {allowedTrades.flatMap((trade) =>
                allowedLevels.map((level) => {
                  const isActive =
                    normalizeTrade(trade) === normalizeTrade(selectedTrade) &&
                    normalizeLevel(level) === normalizeLevel(selectedLevel);
                  const count = students.filter(
                    (student) =>
                      normalizeTrade(student.trade) === normalizeTrade(trade) &&
                      normalizeLevel(student.level) === normalizeLevel(level)
                  ).length;

                  return (
                    <Button
                      key={`${trade}-${level}`}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      className="h-auto rounded-xl px-4 py-3 text-left"
                      onClick={() => {
                        setSelectedTrade(trade);
                        setSelectedLevel(level);
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{trade}</span>
                        <span className="text-xs opacity-80">
                          {level.replace("L", "Level ")} • {count} students
                        </span>
                      </div>
                    </Button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {!loading ? (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              {selectedClassLabel}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Users className="mr-1 h-3 w-3" />
              {filteredStudents.length} student{filteredStudents.length === 1 ? "" : "s"}
            </Badge>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center">Loading students...</div>
        ) : orderedLevels.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No students found for this trade and class.
          </div>
        ) : (
          <div className="space-y-6">
            {orderedLevels.map((level) => (
              <Card key={level}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Class {level === "No Level" ? level : level.replace("L", "Level ")}</span>
                    <Badge variant="secondary">{studentsByLevel[level].length} students</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Trade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsByLevel[level].map((student) => (
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
                                <span>{student.email || "No email"}</span>
                              </div>
                              {student.phone ? (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span>{student.phone}</span>
                                </div>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="h-3 w-3 text-muted-foreground" />
                              <span>{student.trade}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={student.status === "active" ? "default" : "secondary"}
                              className={student.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/teacher/students/${student.id}`}>
                                <Button variant="ghost" size="sm">
                                  View Details
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-rose-600 border-rose-200"
                                onClick={() => handleDeleteStudent(student.id, student.full_name)}
                                disabled={deletingStudentId === student.id}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
