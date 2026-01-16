import Layout from "@/components/Layout";
import ImageGallery from "@/components/ImageGallery";
import { Wrench, Droplets, Home, Award } from "lucide-react";
import ComputerSy from "@/assets/ComputerSys.jpg"
import PlumbingImage1 from "@/assets/plt/3P0D4794.JPG";
import PlumbingImage2 from "@/assets/plt/3P0D4795.JPG";
import PlumbingImage3 from "@/assets/plt/3P0D4796.JPG";
import PlumbingImage4 from "@/assets/plt/3P0D4797.JPG";
import PlumbingImage5 from "@/assets/plt/3P0D4798.JPG";
import PlumbingImage6 from "@/assets/plt/3P0D4801.JPG";
import PlumbingImage7 from "@/assets/plt/3P0D4802.JPG";
import PlumbingImage8 from "@/assets/plt/3P0D4868.JPG";
import PlumbingImage9 from "@/assets/plt/3P0D4869.JPG";
import PlumbingImage10 from "@/assets/plt/3P0D4870.JPG";

export default function PlumbingTechnology() {
  const galleryImages = [
    PlumbingImage1,
    PlumbingImage2,
    PlumbingImage3,
    PlumbingImage4,
    PlumbingImage5,
    PlumbingImage6,
    PlumbingImage7,
    PlumbingImage8,
    PlumbingImage9,
    PlumbingImage10,
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
            <Wrench className="w-16 h-16 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Plumbing Technology</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
              Become an expert in modern plumbing systems and water management
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-8 rounded-lg shadow-lg hover-lift animate-fadeInLeft">
              <h2 className="text-2xl font-bold mb-4 text-school-primary dark:text-school-accent">Program Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Plumbing Technology program trains students in the installation, maintenance,
                and repair of plumbing systems. Students learn modern plumbing techniques, water
                supply systems, drainage, and sanitation.
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
                  <span>Pipe Installation & Fitting</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Water Supply Systems</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Drainage & Sanitation Systems</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Plumbing Tools & Equipment</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Safety Standards & Regulations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-12 animate-fadeInUp delay-300">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={ComputerSy}
                alt="Plumbing Technology"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Modern Plumbing Systems</h3>
                <p className="text-lg">Expert training in water systems and sanitation</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-100 transform hover:scale-105 transition-all duration-300">
              <Droplets className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Modern Systems</h3>
              <p className="text-muted-foreground">Learn latest plumbing technologies</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-200 transform hover:scale-105 transition-all duration-300">
              <Home className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-200" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Practical Training</h3>
              <p className="text-muted-foreground">Real-world installation experience</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-300 transform hover:scale-105 transition-all duration-300">
              <Award className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-400" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Industry Ready</h3>
              <p className="text-muted-foreground">Meet professional standards</p>
            </div>
          </div>

          <div className="mt-16 animate-fadeInUp delay-400">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Program Gallery</span>
            </h2>
            <ImageGallery
              images={galleryImages}
              altPrefix="Plumbing Technology"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
