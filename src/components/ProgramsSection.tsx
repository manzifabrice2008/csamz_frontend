import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Monitor, 
  Wrench, 
  Building, 
  TreePine,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import tvetImage from "@/assets/tvet-training.jpg";
import computerLab from "@/assets/lab1.jpg";
const programs = [
  {
    icon: Code,
    title: "Software Development",
    duration: "3 Years",
    description: "Comprehensive programming and software engineering skills for developing modern applications and systems.",
    features: ["Programming Languages", "Web Development", "Mobile App Development", "Database Design"],
    link: "/programs/software-development"
  },
  {
    icon: Monitor,
    title: "Computer Systems",
    duration: "3 Years", 
    description: "Computer hardware, networking, and system administration for IT infrastructure management.",
    features: ["Network Administration", "Hardware Maintenance", "System Security", "Technical Support"],
    link: "/programs/computer-systems"
  },
  {
    icon: Wrench,
    title: "Plumbing Technology",
    duration: "3 Years",
    description: "Professional plumbing installation, repair, and maintenance for residential and commercial buildings.",
    features: ["Pipe Installation", "Water Systems", "Drainage Systems", "Plumbing Codes"],
    link: "/programs/plumbing-technology"
  },
  {
    icon: Building,
    title: "Building Construction",
    duration: "3 Years",
    description: "Complete building construction skills from foundation to finishing, including project management.",
    features: ["Construction Methods", "Blueprint Reading", "Site Management", "Safety Protocols"],
    link: "/programs/building-construction"
  },
  {
    icon: TreePine,
    title: "Wood Technology",
    duration: "3 Years",
    description: "Woodworking, furniture making, and carpentry skills for construction and manufacturing industries.",
    features: ["Furniture Making", "Carpentry Skills", "Wood Processing", "Design & Craftsmanship"],
    link: "/programs/wood-technology"
  }
];

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-20 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fadeInDown">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">TVET Programs & Courses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
            Our comprehensive technical and vocational programs are designed to meet industry demands
            and provide students with practical skills for immediate employment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            const animationDelay = `delay-${(index + 1) * 100}`;
            return (
              <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 border shadow-lg hover:-translate-y-2 bg-card animate-fadeInUp ${animationDelay} hover-lift`}>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-school-primary/10 dark:bg-school-accent/20 p-3 rounded-full group-hover:bg-school-primary dark:group-hover:bg-school-accent group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-6 w-6 text-school-primary dark:text-school-accent group-hover:text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-school-primary dark:text-school-accent">{program.title}</CardTitle>
                      <p className="text-sm text-school-secondary dark:text-school-accent/80 font-medium">{program.duration}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{program.description}</p>
                  <ul className="space-y-2 mb-6">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-foreground">
                        <div className="w-2 h-2 bg-school-secondary dark:bg-school-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-school-primary dark:group-hover:bg-school-accent group-hover:text-white group-hover:border-school-primary dark:group-hover:border-school-accent transition-all duration-300 transform group-hover:scale-105"
                    asChild
                  >
                    <Link to={program.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeInLeft">
            <h3 className="text-3xl md:text-4xl font-bold text-school-primary dark:text-school-accent mb-6">
              Hands-On Learning Experience
            </h3>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Our TVET programs emphasize practical, hands-on learning in state-of-the-art workshops 
              and laboratories. Students work with industry-standard equipment and real-world projects 
              that prepare them for immediate employment upon graduation.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-foreground hover:translate-x-2 transition-transform duration-300">
                <div className="w-3 h-3 bg-school-secondary dark:bg-school-accent rounded-full mr-4 animate-pulse-slow"></div>
                <span>Industry-certified instructors with real-world experience</span>
              </li>
              <li className="flex items-center text-foreground hover:translate-x-2 transition-transform duration-300">
                <div className="w-3 h-3 bg-school-secondary dark:bg-school-accent rounded-full mr-4 animate-pulse-slow"></div>
                <span>Modern workshops and computer labs</span>
              </li>
              <li className="flex items-center text-foreground hover:translate-x-2 transition-transform duration-300">
                <div className="w-3 h-3 bg-school-secondary dark:bg-school-accent rounded-full mr-4 animate-pulse-slow"></div>
                <span>Practical training with industry-standard tools</span>
              </li>
              <li className="flex items-center text-foreground hover:translate-x-2 transition-transform duration-300">
                <div className="w-3 h-3 bg-school-secondary dark:bg-school-accent rounded-full mr-4 animate-pulse-slow"></div>
                <span>Job placement assistance for graduates</span>
              </li>
            </ul>
            <Button size="lg" className="bg-school-primary dark:bg-school-accent hover:bg-school-primary-light dark:hover:bg-school-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl" asChild>
              <Link to="/apply">
                Apply for Admission
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 animate-fadeInRight">
            <img 
              src={tvetImage} 
              alt="Students in TVET training workshop"
              className="rounded-lg shadow-lg w-full h-64 object-cover hover:scale-105 transition-transform duration-500 hover:shadow-2xl"
            />
            <img 
              src={computerLab} 
              alt="Computer lab training"
              className="rounded-lg shadow-lg w-full h-64 object-cover hover:scale-105 transition-transform duration-500 hover:shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;