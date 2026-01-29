import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { adminUserApi, AdminUser } from "@/services/api";
import { Loader2, Trash2, RefreshCw, ShieldCheck, UserX, UserCheck, Shield } from "lucide-react";
import { getUser } from "@/lib/auth";

export default function AdminUsers() {
    const { toast } = useToast();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const currentUser = getUser();

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await adminUserApi.list();
            if (response.success) {
                setAdmins(response.admins);
            }
        } catch (error: any) {
            toast({
                title: "Failed to load admins",
                description: error?.message || "Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleStatusToggle = async (adminId: number, currentStatus: string) => {
        try {
            setActionLoadingId(adminId);
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const response = await adminUserApi.updateStatus(adminId, newStatus);

            if (response.success) {
                toast({
                    title: "Success",
                    description: `Admin marked as ${newStatus}.`,
                });
                setAdmins(admins.map(a => a.id === adminId ? { ...a, status: newStatus } : a));
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

    const handleDelete = async (adminId: number) => {
        if (adminId === currentUser?.id) {
            toast({
                title: "Action Forbidden",
                description: "You cannot delete your own account.",
                variant: "destructive",
            });
            return;
        }

        if (!window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) return;

        try {
            setActionLoadingId(adminId);
            const response = await adminUserApi.delete(adminId);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Admin deleted successfully.",
                });
                setAdmins(admins.filter(a => a.id !== adminId));
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
                                    <ShieldCheck className="w-6 h-6 text-school-primary dark:text-school-accent" />
                                    Admin User Management
                                </CardTitle>
                                <CardDescription>View and manage all system administrators.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchAdmins} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                Refresh List
                            </Button>
                        </CardHeader>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Administrators</CardTitle>
                            <CardDescription>Manage admin access and roles.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-school-primary" />
                                </div>
                            ) : admins.length === 0 ? (
                                <div className="text-center text-muted-foreground py-12">No admins found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Admin Name</TableHead>
                                                <TableHead>Username & Role</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {admins.map((admin) => (
                                                <TableRow key={admin.id}>
                                                    <TableCell>
                                                        <div className="font-semibold">{admin.full_name}</div>
                                                        <div className="text-xs text-muted-foreground">ID: {admin.id}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">@{admin.username}</div>
                                                        <Badge variant="secondary" className="text-[10px] h-4 uppercase">
                                                            {admin.role || "admin"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{admin.email}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={(admin.status || "active") === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                                                            {admin.status || "active"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className={(admin.status || "active") === "active" ? "text-amber-600 border-amber-200" : "text-emerald-600 border-emerald-200"}
                                                                onClick={() => handleStatusToggle(admin.id, admin.status || "active")}
                                                                disabled={actionLoadingId === admin.id || admin.id === currentUser?.id}
                                                            >
                                                                {actionLoadingId === admin.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    (admin.status || "active") === "active" ? (
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
                                                                onClick={() => handleDelete(admin.id)}
                                                                disabled={actionLoadingId === admin.id || admin.id === currentUser?.id}
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
