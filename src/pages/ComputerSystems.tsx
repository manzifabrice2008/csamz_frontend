import Layout from "@/components/Layout";
import ImageGallery from "@/components/ImageGallery";
import { Monitor, Server, Network, Award } from "lucide-react";
import ComputerSys from "@/assets/plumb.jpg"
import csaImage01 from "@/assets/csa/3P0D4776.JPG";
import csaImage02 from "@/assets/csa/3P0D4778.JPG";
import csaImage03 from "@/assets/csa/3P0D4780.JPG";
import csaImage04 from "@/assets/csa/3P0D4782.JPG";
import csaImage05 from "@/assets/csa/3P0D4783.JPG";
import csaImage06 from "@/assets/csa/3P0D4785.JPG";
import csaImage07 from "@/assets/csa/3P0D4833.JPG";
import csaImage08 from "@/assets/csa/3P0D4834.JPG";
import csaImage09 from "@/assets/csa/3P0D4835.JPG";
export default function ComputerSystems() {
  const csaImages = [
      csaImage01,
      csaImage02,
      csaImage03,
      csaImage04,
      csaImage05,
      csaImage06,
      csaImage07,
      csaImage08,
      csaImage09,
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
            <Monitor className="w-16 h-16 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Computer Systems & Architecture</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
              Master computer hardware, networking, and system administration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-8 rounded-lg shadow-lg hover-lift animate-fadeInLeft">
              <h2 className="text-2xl font-bold mb-4 text-school-primary dark:text-school-accent">Program Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Computer Systems program focuses on computer hardware, networking, and
                system administration. Students gain practical skills in installing, maintaining,
                and troubleshooting computer systems and networks.
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
                  <span>Computer Hardware & Assembly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-school-primary mr-2">•</span>
                  <span>Network Configuration & Management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-school-primary mr-2">•</span>
                  <span>Operating Systems Administration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-school-primary mr-2">•</span>
                  <span>System Troubleshooting & Repair</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-12 animate-fadeInUp delay-300">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={ComputerSys}
                alt="Computer Systems"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Computer Systems & Networking</h3>
                <p className="text-lg">Mastering hardware and network infrastructure</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-100 transform hover:scale-105 transition-all duration-300">
              <Server className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Server Management</h3>
              <p className="text-muted-foreground">Hands-on server administration</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-200 transform hover:scale-105 transition-all duration-300">
              <Network className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-200" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Network Labs</h3>
              <p className="text-muted-foreground">Configure real networking equipment</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-lg hover-lift animate-scaleIn delay-300 transform hover:scale-105 transition-all duration-300">
              <Award className="w-12 h-12 mx-auto mb-4 text-school-primary dark:text-school-accent animate-float delay-400" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Certifications</h3>
              <p className="text-muted-foreground">Prepare for industry certifications</p>
            </div>
          </div>

          <div className="mt-16 animate-fadeInUp delay-400">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Program Gallery</span>
            </h2>
            <ImageGallery
              images={csaImages}
              altPrefix="Computer Systems"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
