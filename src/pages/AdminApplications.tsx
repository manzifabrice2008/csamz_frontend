import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
  Filter,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, applicationsApi, StudentApplication } from "@/services/api";

export default function AdminApplications() {
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'approved' | 'rejected'>('approved');
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const { toast } = useToast();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");

  const getReportUrl = (application: StudentApplication) => {
    if (application.report_url) return application.report_url;
    if (!application.report_path) return null;
    if (application.report_path.startsWith("http")) return application.report_path;
    return `${apiOrigin}${application.report_path}`;
  };

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filterStatus, filterProgram]);

  const fetchApplications = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await applicationsApi.getAll();
      setApplications(response.applications);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch applications',
        variant: "destructive",
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await applicationsApi.getStats();
      setStats(response.stats);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (filterStatus !== "all") {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    if (filterProgram !== "all") {
      filtered = filtered.filter(app => app.program === filterProgram);
    }

    setFilteredApplications(filtered);
  };

  const handleViewApplication = (application: StudentApplication) => {
    setSelectedApp(application);
    setViewDialogOpen(true);
  };

  const handleStatusChange = (application: StudentApplication, status: 'approved' | 'rejected') => {
    setSelectedApp(application);
    setStatusAction(status);
    setAdminNotes("");
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedApp) return;

    try {
      setLoading(true);
      const response = await applicationsApi.updateStatus(selectedApp.id, {
        status: statusAction,
        admin_notes: adminNotes,
      });

      toast({
        title: "Success",
        description: `Application ${statusAction}. ${response.sms_sent ? 'SMS notification sent to student.' : 'Student will be notified.'}`,
      });

      await fetchApplications();
      await fetchStats();
      setStatusDialogOpen(false);
      setSelectedApp(null);
      setAdminNotes("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to update application',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      setLoading(true);
      await applicationsApi.delete(id);
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
      await fetchApplications();
      await fetchStats();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to delete application',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const programs = Array.from(new Set(applications.map(app => app.program)));

  return (
    <AdminLayout>
      <section className="p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 animate-fadeInDown">
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Student Applications</span>
            </h1>
            <p className="text-muted-foreground">
              Manage and review student applications
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="w-10 h-10 text-school-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <XCircle className="w-10 h-10 text-red-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterProgram} onValueChange={setFilterProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map(program => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-school-primary dark:text-school-accent">
                Applications ({filteredApplications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetchLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
                  <span className="ml-2 text-muted-foreground">Loading applications...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p>{error}</p>
                  <Button onClick={fetchApplications} variant="outline" className="mt-4">
                    Retry
                  </Button>
                </div>
              ) : filteredApplications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No applications found.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <Card key={application.id} className="hover-lift">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg">{application.full_name}</h3>
                              {getStatusBadge(application.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                {application.program}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {application.phone_number}
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {application.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Applied: {new Date(application.created_at!).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewApplication(application)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            
                            {application.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(application, 'approved')}
                                  disabled={loading}
                                  className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(application, 'rejected')}
                                  disabled={loading}
                                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}

                            {application.report_path && (
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                              >
                                <a
                                  href={getReportUrl(application) || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  Report
                                </a>
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(application.id)}
                              disabled={loading}
                              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Complete information about the student application
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedApp.full_name}</h3>
                {getStatusBadge(selectedApp.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4" />{selectedApp.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p>{new Date(selectedApp.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p>{selectedApp.gender}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1" />{selectedApp.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Program</p>
                  <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4" />{selectedApp.program}</p>
                </div>
                {selectedApp.previous_school && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Previous School</p>
                    <p>{selectedApp.previous_school}</p>
                  </div>
                )}
                {selectedApp.previous_qualification && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Previous Qualification</p>
                    <p>{selectedApp.previous_qualification}</p>
                  </div>
                )}
                {selectedApp.guardian_name && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guardian Name</p>
                    <p>{selectedApp.guardian_name}</p>
                  </div>
                )}
                {selectedApp.guardian_phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guardian Phone</p>
                    <p>{selectedApp.guardian_phone}</p>
                  </div>
                )}
                {getReportUrl(selectedApp) && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Academic Report</p>
                    <Button variant="outline" asChild className="mt-2">
                      <a
                        href={getReportUrl(selectedApp)!}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Download Report
                      </a>
                    </Button>
                  </div>
                )}
                {selectedApp.admin_notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Admin Notes</p>
                    <p className="bg-muted p-3 rounded">{selectedApp.admin_notes}</p>
                  </div>
                )}
                {selectedApp.approved_by_name && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Processed By</p>
                    <p>{selectedApp.approved_by_name} on {new Date(selectedApp.approved_at!).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'approved' ? 'Approve' : 'Reject'} Application
            </DialogTitle>
            <DialogDescription>
              {statusAction === 'approved' 
                ? 'The student will receive an SMS notification about the approval.'
                : 'The student will receive an SMS notification about the rejection.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message to Student (Optional)
              </label>
              <Textarea
                placeholder={statusAction === 'approved' 
                  ? "e.g., Please visit the school office with your documents."
                  : "e.g., You may reapply next semester."}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={confirmStatusChange} 
              disabled={loading}
              className={statusAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm ${statusAction === 'approved' ? 'Approval' : 'Rejection'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
