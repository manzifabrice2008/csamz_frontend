import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, CheckCircle, XCircle, Eye, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/api";

interface Testimonial {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  program: string;
  graduation_year: string;
  rating: number;
  testimonial_text: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string;
  approved_by_name: string;
  created_at: string;
}

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, [selectedTab]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/testimonials/status/${selectedTab}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedTestimonial || !actionType) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/testimonials/${selectedTestimonial.id}/${actionType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ admin_notes: adminNotes }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `Testimonial ${actionType}d successfully`,
        });
        setDialogOpen(false);
        setAdminNotes("");
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        });
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const openDialog = (testimonial: Testimonial, action: "approve" | "reject") => {
    setSelectedTestimonial(testimonial);
    setActionType(action);
    setAdminNotes("");
    setDialogOpen(true);
  };

  const renderTestimonialCard = (testimonial: Testimonial) => (
    <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{testimonial.full_name}</h3>
            <p className="text-sm text-muted-foreground">{testimonial.program}</p>
            {testimonial.graduation_year && (
              <p className="text-sm text-muted-foreground">
                Class of {testimonial.graduation_year}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < testimonial.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>

        <p className="text-muted-foreground mb-4 italic">"{testimonial.testimonial_text}"</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{testimonial.email}</Badge>
          {testimonial.phone_number && (
            <Badge variant="outline">{testimonial.phone_number}</Badge>
          )}
          <Badge
            variant={
              testimonial.status === "approved"
                ? "default"
                : testimonial.status === "rejected"
                  ? "destructive"
                  : "secondary"
            }
          >
            {testimonial.status}
          </Badge>
        </div>

        {testimonial.admin_notes && (
          <div className="bg-muted p-3 rounded-md mb-4">
            <p className="text-sm font-semibold">Admin Notes:</p>
            <p className="text-sm text-muted-foreground">{testimonial.admin_notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          {testimonial.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => openDialog(testimonial, "approve")}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openDialog(testimonial, "reject")}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(testimonial.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Testimonials Management</h1>
          <p className="text-muted-foreground">
            Review and manage student testimonials
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              <MessageSquare className="w-4 h-4 mr-2" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <XCircle className="w-4 h-4 mr-2" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No {selectedTab} testimonials found
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {testimonials.map(renderTestimonialCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Approve" : "Reject"} Testimonial
              </DialogTitle>
              <DialogDescription>
                {selectedTestimonial && (
                  <>
                    <p className="font-semibold mt-2">{selectedTestimonial.full_name}</p>
                    <p className="text-sm italic mt-2">
                      "{selectedTestimonial.testimonial_text}"
                    </p>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="admin_notes">Admin Notes (Optional)</Label>
                <Textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                className={
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
                variant={actionType === "reject" ? "destructive" : "default"}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
