import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { teacherAdminApi, TeacherUser } from "@/services/api";
import { Loader2, CheckCircle2, XCircle, RefreshCw, UserCheck2 } from "lucide-react";

type TeacherStatus = "pending" | "approved" | "rejected";

const statusStyles: Record<TeacherStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-200",
};

export default function AdminTeachers() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<TeacherUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const pendingCount = useMemo(() => teachers.filter((t) => t.status === "pending").length, [teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherAdminApi.list();
      setTeachers(response.teachers);
    } catch (error: any) {
      toast({
        title: "Failed to load teachers",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleStatusChange = async (teacherId: number, status: TeacherStatus) => {
    try {
      setActionLoadingId(teacherId);
      await teacherAdminApi.updateStatus(teacherId, status);
      toast({
        title: "Success",
        description: `Teacher marked as ${status}.`,
      });
      await fetchTeachers();
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

  return (
    <AdminLayout>
      <section className="p-6">
        <div className="container mx-auto max-w-6xl space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <UserCheck2 className="w-6 h-6 text-school-primary dark:text-school-accent" />
                  Teacher Approvals
                </CardTitle>
                <CardDescription>Review teacher registrations and approve or reject access.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  Pending: {pendingCount}
                </Badge>
                <Button variant="outline" size="sm" onClick={fetchTeachers} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Teacher Accounts</CardTitle>
              <CardDescription>Latest registrations appear first.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-school-primary" />
                </div>
              ) : teachers.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">No teacher registrations yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-semibold">{teacher.full_name}</TableCell>
                          <TableCell>{teacher.username}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>
                            <Badge className={statusStyles[teacher.status]}>{teacher.status}</Badge>
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-200 text-emerald-600"
                              onClick={() => handleStatusChange(teacher.id, "approved")}
                              disabled={teacher.status === "approved" || actionLoadingId === teacher.id}
                            >
                              {actionLoadingId === teacher.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-200 text-rose-600"
                              onClick={() => handleStatusChange(teacher.id, "rejected")}
                              disabled={teacher.status === "rejected" || actionLoadingId === teacher.id}
                            >
                              {actionLoadingId === teacher.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </>
                              )}
                            </Button>
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


