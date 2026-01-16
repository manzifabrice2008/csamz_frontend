import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, Star, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/services/api";

interface Testimonial {
  id: number;
  full_name: string;
  program: string;
  graduation_year?: string;
  rating: number;
  testimonial_text: string;
  profile_image?: string;
  created_at: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(4.9);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/approved`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);

        // Calculate average rating
        if (data.length > 0) {
          const avg = data.reduce((sum: number, t: Testimonial) => sum + t.rating, 0) / data.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitialLetter = (testimonial: Testimonial) => {
    const name = testimonial.full_name?.trim();
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";
  };
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-school-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Student Testimonials</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hear from our students and graduates about their transformative experiences at CSAM Zaccaria TVET School
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-school-primary dark:border-school-accent"></div>
            <p className="text-muted-foreground mt-4">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquarePlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg mb-4">No testimonials yet</p>
            <p className="text-sm text-muted-foreground">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="hover-lift animate-fadeInUp shadow-lg hover:shadow-2xl transition-all duration-300 border-2 hover:border-school-primary/50 dark:hover:border-school-accent/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-school-primary/10 dark:bg-school-accent/10 text-2xl font-bold text-school-primary dark:text-school-accent flex items-center justify-center ring-4 ring-school-primary/20 dark:ring-school-accent/20">
                        {getInitialLetter(testimonial)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-school-primary dark:bg-school-accent rounded-full flex items-center justify-center shadow-lg">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-foreground">{testimonial.full_name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {testimonial.program}
                        {testimonial.graduation_year && ` - Class of ${testimonial.graduation_year}`}
                      </p>
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.testimonial_text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12 space-y-6 animate-fadeInUp delay-400">
          {testimonials.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-school-primary/10 dark:bg-school-accent/10 px-6 py-3 rounded-full">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground">
                {averageRating}/5 Average Student Satisfaction Rating ({testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'})
              </span>
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          )}

          <div>
            <Button
              size="lg"
              className="bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
              asChild
            >
              <Link to="/testimonial/submit">
                <MessageSquarePlus className="w-5 h-5 mr-2" />
                Share Your Experience
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Are you a student or graduate? Share your story with us!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
