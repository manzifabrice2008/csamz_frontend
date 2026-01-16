import Layout from "@/components/Layout";
import ImageGallery from "@/components/ImageGallery";
import { Code, Laptop, Users, Award } from "lucide-react";
import SoftwareDev from "@/assets/computer-lab.jpg";
import sodImage01 from "@/assets/sod/3P0D4850.JPG";
import sodImage02 from "@/assets/sod/3P0D4851.JPG";
import sodImage03 from "@/assets/sod/3P0D4852.JPG";
import sodImage04 from "@/assets/sod/3P0D4855.JPG";
import sodImage05 from "@/assets/sod/3P0D4884.JPG";
import sodImage06 from "@/assets/sod/3P0D4887.JPG";
import sodImage07 from "@/assets/sod/3P0D4888.JPG";
import sodImage08 from "@/assets/sod/3P0D4889.JPG";
import sodImage09 from "@/assets/sod/3P0D4904.JPG";
import sodImage10 from "@/assets/sod/3P0D4905.JPG";
import sodImage11 from "@/assets/sod/3P0D4906.JPG";
import sodImage12 from "@/assets/sod/3P0D4907.JPG";
import sodImage13 from "@/assets/sod/3P0D4908.JPG";
import sodImage14 from "@/assets/sod/3P0D4909.JPG";
import sodImage15 from "@/assets/sod/sod1.JPG";

export default function SoftwareDevelopment() {
  const galleryImages = [
    sodImage01,
    sodImage02,
    sodImage03,
    sodImage04,
    sodImage05,
    sodImage06,
    sodImage07,
    sodImage08,
    sodImage09,
    sodImage10,
    sodImage11,
    sodImage12,
    sodImage13,
    sodImage14,
    sodImage15,
  ];

  return (
    <Layout>
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 animate-fadeInDown">
            <Code className="w-16 h-16 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Software Development</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
              Learn to build modern applications and become a skilled software developer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-8 rounded-lg shadow-lg hover-lift animate-fadeInLeft">
              <h2 className="text-2xl font-bold mb-4 text-school-primary dark:text-school-accent">Program Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Software Development program equips students with cutting-edge programming skills 
                and software engineering principles. Students learn to design, develop, and maintain 
                software applications using modern technologies and best practices.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Duration: 3 years | Level: A2
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-lg hover-lift animate-fadeInRight">
              <h2 className="text-2xl font-bold mb-4 text-school-primary dark:text-school-accent">What You'll Learn</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Programming Languages (Python, Java, JavaScript, PHP, Dart)</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Web Development (HTML, CSS, React, Vue.js, Lalavel, Tailwind)</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Database Management & SQL & NO SQL</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Software Engineering Principles</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Mobile App Development using Flutter</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-12 animate-fadeInUp delay-300">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={SoftwareDev} 
                alt="Software Development" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Modern Software Development</h3>
                <p className="text-lg">Building the future with code</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-100 transform hover:scale-105 transition-all duration-300">
              <Laptop className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Modern Labs</h3>
              <p className="text-muted-foreground">Fully equipped computer labs with latest software</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-200 transform hover:scale-105 transition-all duration-300">
              <Users className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-200" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Expert Instructors</h3>
              <p className="text-muted-foreground">Learn from experienced software professionals</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-300 transform hover:scale-105 transition-all duration-300">
              <Award className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-400" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Industry Projects</h3>
              <p className="text-muted-foreground">Real-world experience through practical projects</p>
            </div>
          </div>

          <div className="animate-fadeInUp delay-400">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Program Gallery</span>
            </h2>
            <ImageGallery 
              images={galleryImages}
              altPrefix="Software Development"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
