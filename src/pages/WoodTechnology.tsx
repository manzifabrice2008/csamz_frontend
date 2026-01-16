import Layout from "@/components/Layout";
import ImageGallery from "@/components/ImageGallery";
import { TreePine, Hammer, Box, Award } from "lucide-react";
import WoodTechnolog from "@/assets/wot.jpg"
import WoodImage1 from "@/assets/wot/3P0D4786.JPG";
import WoodImage2 from "@/assets/wot/3P0D4787.JPG";
import WoodImage3 from "@/assets/wot/3P0D4788.JPG";
import WoodImage4 from "@/assets/wot/3P0D4789.JPG";
import WoodImage5 from "@/assets/wot/3P0D4790.JPG";
import WoodImage6 from "@/assets/wot/3P0D4791.JPG";
import WoodImage7 from "@/assets/wot/3P0D4792.JPG";
import WoodImage8 from "@/assets/wot/3P0D4793.JPG";
import WoodImage9 from "@/assets/wot/3P0D4805.JPG";
import WoodImage10 from "@/assets/wot/3P0D4807.JPG";

export default function WoodTechnology() {
  const galleryImages = [
    WoodImage1,
    WoodImage2,
    WoodImage3,
    WoodImage4,
    WoodImage5,
    WoodImage6,
    WoodImage7,
    WoodImage8,
    WoodImage9,
    WoodImage10,
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
            <TreePine className="w-16 h-16 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Wood Technology</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
              Master carpentry, furniture making, and wood craftsmanship
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-8 rounded-lg shadow-lg hover-lift animate-fadeInLeft">
              <h2 className="text-2xl font-bold mb-4 text-school-primary dark:text-school-accent">Program Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Wood Technology program trains students in woodworking, carpentry, and furniture
                making. Students learn to work with various wood types, use modern woodworking
                equipment, and create quality wooden products.
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
                  <span>Wood Types & Properties</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Furniture Design & Construction</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Carpentry & Joinery Techniques</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Woodworking Tools & Machinery</span>
                </li>
                <li className="flex items-start hover:translate-x-2 transition-transform duration-300">
                  <span className="text-school-primary dark:text-school-accent mr-2 animate-pulse-slow">•</span>
                  <span>Wood Finishing & Preservation</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-12 animate-fadeInUp delay-300">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={WoodTechnolog}
                alt="Wood Technology"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Wood Technology & Craftsmanship</h3>
                <p className="text-lg">Creating quality furniture and woodwork</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-100 transform hover:scale-105 transition-all duration-300">
              <Hammer className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Craftsmanship</h3>
              <p className="text-muted-foreground">Traditional and modern techniques</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-200 transform hover:scale-105 transition-all duration-300">
              <Box className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-200" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Workshop Access</h3>
              <p className="text-muted-foreground">Fully equipped woodworking facilities</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-300 transform hover:scale-105 transition-all duration-300">
              <Award className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-400" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Portfolio Building</h3>
              <p className="text-muted-foreground">Create professional work samples</p>
            </div>
          </div>

          <div className="mt-16 animate-fadeInUp delay-400">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Program Gallery</span>
            </h2>
            <ImageGallery
              images={galleryImages}
              altPrefix="Wood Technology"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
