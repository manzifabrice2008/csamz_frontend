import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/api";

const programs = [
  "Software Development",
  "Computer Systems",
  "Plumbing Technology",
  "Building Construction",
  "Wood Technology",
];

export default function SubmitTestimonial() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    program: "",
    graduation_year: "",
    testimonial_text: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Success!",
          description: "Your testimonial has been submitted for review",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit testimonial",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center py-20">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your testimonial has been submitted successfully. Our admin team will review it shortly.
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12 animate-fadeInDown">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Share Your Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Tell us about your journey at CSAM Zaccaria TSS
            </p>
          </div>

          <Card className="shadow-lg animate-fadeInUp">
            <CardHeader>
              <CardTitle>Submit Your Testimonial</CardTitle>
              <CardDescription>
                Your feedback helps future students make informed decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="+250 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="program">Program *</Label>
                      <Select
                        value={formData.program}
                        onValueChange={(value) =>
                          setFormData({ ...formData, program: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="graduation_year">Graduation Year</Label>
                      <Input
                        id="graduation_year"
                        name="graduation_year"
                        type="text"
                        value={formData.graduation_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 2024"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <Label>Your Rating *</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      You rated: {rating} star{rating > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Testimonial Text */}
                <div>
                  <Label htmlFor="testimonial_text">Your Testimonial *</Label>
                  <Textarea
                    id="testimonial_text"
                    name="testimonial_text"
                    value={formData.testimonial_text}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Share your experience at CSAM Zaccaria TSS. What did you learn? How has it impacted your career?"
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.testimonial_text.length} characters
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90"
                  size="lg"
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Testimonial
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Your testimonial will be reviewed by our admin team before being published
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
