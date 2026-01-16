import { useState, useRef, ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Users,
  Loader2,
  CheckCircle2,
  FileText,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { applicationsApi, CreateApplicationData, studentAuthApi } from "@/services/api";

export default function ApplyNow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const student = useMemo(() => studentAuthApi.getStoredStudent(), []);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<CreateApplicationData & { reportFile?: File }>({
    full_name: "",
    email: student?.email || "",
    phone_number: "",
    date_of_birth: "",
    gender: "Male",
    address: "",
    program: "",
    previous_school: "",
    previous_qualification: "",
    guardian_name: "",
    guardian_phone: "",
    reportFile: undefined,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if file is a PDF and under 5MB
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, reportFile: file }));
    }
  };
  
  const removeFile = () => {
    setFormData(prev => ({ ...prev, reportFile: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const programs = [
    "Software Development",
    "Computer Systems and Networks",
    "Plumbing Technology",
    "Building Construction",
    "Wood Technology"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { reportFile, ...applicationData } = formData;

      const payload: CreateApplicationData & { report?: File } = {
        ...applicationData,
        email: applicationData.email?.trim() || undefined,
        report: reportFile,
      };

      await applicationsApi.create(payload);
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been received. We'll contact you soon.",
      });

      setSubmitted(true);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Unable to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
          </div>

          <Card className="w-full max-w-2xl shadow-2xl hover-lift animate-fadeInUp relative z-10 text-center">
            <CardContent className="p-12">
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 gradient-text">
                Application Submitted Successfully!
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for applying to CSAM Zaccaria TVET. Our admissions team will review your application and contact you via phone or email within 3-5 business days.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to homepage...
              </p>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 animate-fadeInDown">
            <div className="mx-auto w-16 h-16 bg-school-primary dark:bg-school-accent rounded-full flex items-center justify-center mb-4 animate-float">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Apply Now</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your journey to excellence at CSAM Zaccaria TVET. Fill out the application form below.
            </p>
          </div>

          <Card className="shadow-2xl hover-lift animate-fadeInUp">
            <CardHeader>
              <CardTitle className="text-2xl text-school-primary dark:text-school-accent">
                Student Application Form
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                All fields marked with * are required
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        required
                        disabled={loading}
                        className="w-full p-2 border rounded-md bg-background text-foreground"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="phone_number" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="+250 XXX XXX XXX"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address (optional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      disabled={loading}
                      className="h-20"
                    />
                  </div>
                </div>

                {/* Program Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Program Selection
                  </h3>

                  <div>
                    <Label htmlFor="program">Choose Your Program *</Label>
                    <select
                      id="program"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      required
                      disabled={loading}
                      className="w-full p-2 border rounded-md bg-background text-foreground"
                    >
                      <option value="">Select a program</option>
                      {programs.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Educational Background */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Educational Background</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="previous_school">Previous School</Label>
                      <Input
                        id="previous_school"
                        placeholder="Name of your previous school"
                        value={formData.previous_school}
                        onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="previous_qualification">Previous Qualification</Label>
                      <Input
                        id="previous_qualification"
                        placeholder="e.g., O-Level, A-Level"
                        value={formData.previous_qualification}
                        onChange={(e) => setFormData({ ...formData, previous_qualification: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Guardian Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guardian_name">Guardian Name</Label>
                      <Input
                        id="guardian_name"
                        placeholder="Parent/Guardian full name"
                        value={formData.guardian_name}
                        onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="guardian_phone">Guardian Phone</Label>
                      <Input
                        id="guardian_phone"
                        type="tel"
                        placeholder="+250 XXX XXX XXX"
                        value={formData.guardian_phone}
                        onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Report Upload Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Academic Report (Optional)
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="report">Upload your latest academic report (PDF, max 10MB)</Label>
                    <input
                      type="file"
                      id="report"
                      ref={fileInputRef}
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={loading}
                    />
                    
                    {!formData.reportFile ? (
                      <div 
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF only (max 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{formData.reportFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(formData.reportFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={removeFile}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  By submitting this form, you agree to our terms and conditions. 
                  We will contact you via phone or email regarding your application status.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
