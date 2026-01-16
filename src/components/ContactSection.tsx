import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send
} from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-muted/50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-secondary rounded-full blur-3xl animate-float delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fadeInDown">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Contact Us</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
            Ready to start your journey with us? Get in touch to learn more about our programs 
            and admission process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center shadow-lg border bg-card hover-lift animate-scaleIn delay-100 transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="bg-school-primary/10 dark:bg-school-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <MapPin className="h-8 w-8 text-school-primary dark:text-school-accent" />
              </div>
              <h4 className="text-xl font-bold text-school-primary dark:text-school-accent mb-2">Our Location</h4>
              <p className="text-muted-foreground leading-relaxed">
                Muko Sector<br />
                Gicumbi District<br />
                Northern Province<br />
                Rwanda
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border bg-card hover-lift animate-scaleIn delay-200 transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="bg-school-secondary/10 dark:bg-school-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Phone className="h-8 w-8 text-school-secondary dark:text-school-accent" />
              </div>
              <h4 className="text-xl font-bold text-school-primary dark:text-school-accent mb-2">Phone & Email</h4>
              <p className="text-muted-foreground leading-relaxed">
                Phone: +250 788 123 456<br />
                Email: info@csamzaccaria.edu.rw<br />
                WhatsApp: +250 788 123 456
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border bg-card hover-lift animate-scaleIn delay-300 transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="bg-school-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Clock className="h-8 w-8 text-school-accent" />
              </div>
              <h4 className="text-xl font-bold text-school-primary dark:text-school-accent mb-2">Office Hours</h4>
              <p className="text-muted-foreground leading-relaxed">
                Monday - Friday: 8:00 AM - 5:00 PM<br />
                Saturday: 9:00 AM - 1:00 PM<br />
                Sunday: Closed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="shadow-lg border bg-card hover-lift animate-fadeInLeft">
            <CardHeader>
              <CardTitle className="text-2xl text-school-primary dark:text-school-accent">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    First Name
                  </label>
                  <Input placeholder="Your first name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Last Name
                  </label>
                  <Input placeholder="Your last name" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>
                <Input type="email" placeholder="your.email@example.com" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number
                </label>
                <Input type="tel" placeholder="+250 788 123 456" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Program of Interest
                </label>
                <select className="w-full p-3 border bg-background text-foreground rounded-md focus:ring-2 focus:ring-school-primary dark:focus:ring-school-accent focus:border-transparent">
                  <option>Select a program...</option>
                  <option>Software Development</option>
                  <option>Computer Systems</option>
                  <option>Plumbing Technology</option>
                  <option>Building Construction</option>
                  <option>Wood Technology</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Message
                </label>
                <Textarea 
                  placeholder="Tell us more about your interests and questions..."
                  className="h-32"
                />
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-school-primary dark:bg-school-accent hover:bg-school-primary-light dark:hover:bg-school-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                asChild
              >
                <a href="mailto:info@csamzaccaria.edu.rw">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-8 animate-fadeInRight">
            <Card className="shadow-lg border-0 bg-school-primary dark:bg-school-accent text-white dark:text-school-primary hover-lift transform hover:scale-105 transition-all duration-500">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold mb-4">Visit Our Campus</h4>
                <p className="leading-relaxed mb-6">
                  We encourage prospective students and parents to visit our campus in Muko, 
                  Gicumbi. See our state-of-the-art facilities, meet our instructors, and 
                  get a feel for the CSAM Zaccaria learning environment.
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-school-accent dark:bg-school-primary text-school-primary dark:text-white hover:bg-school-accent/90 dark:hover:bg-school-primary/90"
                >
                  Schedule a Visit
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border bg-card hover-lift transform hover:scale-105 transition-all duration-500">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-school-primary dark:text-school-accent mb-4">
                  Apply for Admission
                </h4>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Ready to take the next step? Our admission process is straightforward, 
                  and our team is here to guide you through every step of the application.
                </p>
                <ul className="space-y-3 text-foreground mb-6">
                  <li className="flex items-center hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-school-secondary dark:bg-school-accent rounded-full mr-3 animate-pulse-slow"></div>
                    Complete application form
                  </li>
                  <li className="flex items-center hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-school-secondary dark:bg-school-accent rounded-full mr-3 animate-pulse-slow"></div>
                    Submit academic transcripts
                  </li>
                  <li className="flex items-center hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-school-secondary dark:bg-school-accent rounded-full mr-3 animate-pulse-slow"></div>
                    Attend entrance interview
                  </li>
                  <li className="flex items-center hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-school-secondary dark:bg-school-accent rounded-full mr-3 animate-pulse-slow"></div>
                    Receive admission decision
                  </li>
                </ul>
                <Button 
                  size="lg" 
                  className="w-full bg-school-secondary dark:bg-school-accent hover:bg-school-secondary/90 dark:hover:bg-school-accent/90 text-white dark:text-school-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  Start Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;