import Layout from "@/components/Layout";
import ImageGallery from "@/components/ImageGallery";
import { Building, HardHat, Ruler, Award } from "lucide-react";
import BuildinCons from "@/assets/building.jpg"
import BuildingImage1 from "@/assets/bdc/3P0D4819.JPG";
import BuildingImage2 from "@/assets/bdc/3P0D4820.JPG";
import BuildingImage3 from "@/assets/bdc/3P0D4876.JPG";
import BuildingImage4 from "@/assets/bdc/3P0D4878.JPG";
import BuildingImage5 from "@/assets/bdc/3P0D4879.JPG";
import BuildingImage6 from "@/assets/bdc/3P0D4895.JPG";
import BuildingImage7 from "@/assets/bdc/3P0D4896.JPG";
import BuildingImage8 from "@/assets/bdc/3P0D4897.JPG";
import BuildingImage9 from "@/assets/bdc/3P0D4899.JPG";

export default function BuildingConstruction() {
  const galleryImages = [
    BuildingImage1,
    BuildingImage2,
    BuildingImage3,
    BuildingImage4,
    BuildingImage5,
    BuildingImage6,
    BuildingImage7,
    BuildingImage8,
    BuildingImage9,
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
            <Building className="w-16 h-16 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Building Construction</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
              Master the art and science of modern building construction
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-8 rounded-lg shadow-lg hover-lift animate-fadeInLeft">
              <h2 className="text-2xl font-bold mb-4 text-school-primary dark:text-school-accent">Program Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Building Construction program provides comprehensive training in construction
                techniques, materials, and project management. Students learn to read blueprints,
                work with various construction materials, and understand building codes.
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
                  <span>Construction Methods & Techniques</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Blueprint Reading & Interpretation</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Building Materials & Properties</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Construction Safety & Regulations</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Project Planning & Management</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-12 animate-fadeInUp delay-300">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={BuildinCons}
                alt="Building Construction"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Building Construction Excellence</h3>
                <p className="text-lg">Constructing Rwanda's future infrastructure</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-100 transform hover:scale-105 transition-all duration-300">
              <HardHat className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Safety First</h3>
              <p className="text-muted-foreground">Comprehensive safety training</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-200 transform hover:scale-105 transition-all duration-300">
              <Ruler className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-200" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Precision Skills</h3>
              <p className="text-muted-foreground">Accurate measurement and planning</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-300 transform hover:scale-105 transition-all duration-300">
              <Award className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-400" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Career Ready</h3>
              <p className="text-muted-foreground">Prepared for construction industry</p>
            </div>
          </div>

          <div className="mt-16 animate-fadeInUp delay-400">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Program Gallery</span>
            </h2>
            <ImageGallery
              images={galleryImages}
              altPrefix="Building Construction"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
