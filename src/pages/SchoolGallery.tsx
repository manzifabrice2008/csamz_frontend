import Layout from "@/components/Layout";
import ImageGallery from "@/components/ImageGallery";
import { Camera, Code, Monitor, Wrench, Building, TreePine } from "lucide-react";
import SoftwareImage1 from "@/assets/sod/3P0D4850.JPG";
import SoftwareImage2 from "@/assets/sod/3P0D4851.JPG";
import SoftwareImage3 from "@/assets/sod/3P0D4852.JPG";
import SoftwareImage4 from "@/assets/sod/3P0D4855.JPG";
import SoftwareImage5 from "@/assets/sod/3P0D4884.JPG";
import SoftwareImage6 from "@/assets/sod/3P0D4887.JPG";
import ComputerImage1 from "@/assets/csa/3P0D4776.JPG";
import ComputerImage2 from "@/assets/csa/3P0D4778.JPG";
import ComputerImage3 from "@/assets/csa/3P0D4780.JPG";
import ComputerImage4 from "@/assets/csa/3P0D4782.JPG";
import ComputerImage5 from "@/assets/csa/3P0D4783.JPG";
import ComputerImage6 from "@/assets/csa/3P0D4785.JPG";
import PlumbingImage1 from "@/assets/plt/3P0D4794.JPG";
import PlumbingImage2 from "@/assets/plt/3P0D4795.JPG";
import PlumbingImage3 from "@/assets/plt/3P0D4796.JPG";
import PlumbingImage4 from "@/assets/plt/3P0D4797.JPG";
import PlumbingImage5 from "@/assets/plt/3P0D4798.JPG";
import PlumbingImage6 from "@/assets/plt/3P0D4801.JPG";
import BuildingImage1 from "@/assets/bdc/3P0D4819.JPG";
import BuildingImage2 from "@/assets/bdc/3P0D4820.JPG";
import BuildingImage3 from "@/assets/bdc/3P0D4876.JPG";
import BuildingImage4 from "@/assets/bdc/3P0D4878.JPG";
import BuildingImage5 from "@/assets/bdc/3P0D4879.JPG";
import BuildingImage6 from "@/assets/bdc/3P0D4895.JPG";
import WoodImage1 from "@/assets/wot/3P0D4786.JPG";
import WoodImage2 from "@/assets/wot/3P0D4787.JPG";
import WoodImage3 from "@/assets/wot/3P0D4788.JPG";
import WoodImage4 from "@/assets/wot/3P0D4789.JPG";
import WoodImage5 from "@/assets/wot/3P0D4790.JPG";
import WoodImage6 from "@/assets/wot/3P0D4791.JPG";

const softwareGallery = [
  SoftwareImage1,
  SoftwareImage2,
  SoftwareImage3,
  SoftwareImage4,
  SoftwareImage5,
  SoftwareImage6,
];

const computerGallery = [
  ComputerImage1,
  ComputerImage2,
  ComputerImage3,
  ComputerImage4,
  ComputerImage5,
  ComputerImage6,
];

const plumbingGallery = [
  PlumbingImage1,
  PlumbingImage2,
  PlumbingImage3,
  PlumbingImage4,
  PlumbingImage5,
  PlumbingImage6,
];

const buildingGallery = [
  BuildingImage1,
  BuildingImage2,
  BuildingImage3,
  BuildingImage4,
  BuildingImage5,
  BuildingImage6,
];

const woodGallery = [
  WoodImage1,
  WoodImage2,
  WoodImage3,
  WoodImage4,
  WoodImage5,
  WoodImage6,
];

const SchoolGallery = () => {
  const sections = [
    {
      title: "Software Development",
      description: "Coding bootcamps, collaborative projects, and modern labs that power our software development training.",
      images: softwareGallery,
      icon: Code,
      altPrefix: "Software Development Gallery",
    },
    {
      title: "Computer Systems",
      description: "Hands-on practice with hardware assembly, networking gear, and systems administration exercises.",
      images: computerGallery,
      icon: Monitor,
      altPrefix: "Computer Systems Gallery",
    },
    {
      title: "Plumbing Technology",
      description: "Hands-on sessions in our plumbing workshops showcasing the latest systems and tools.",
      images: plumbingGallery,
      icon: Wrench,
      altPrefix: "Plumbing Gallery",
    },
    {
      title: "Building Construction",
      description: "Students learning construction techniques, site management, and safety protocols.",
      images: buildingGallery,
      icon: Building,
      altPrefix: "Building Construction Gallery",
    },
    {
      title: "Wood Technology",
      description: "Craftsmanship and furniture-making projects from our wood technology program.",
      images: woodGallery,
      icon: TreePine,
      altPrefix: "Wood Technology Gallery",
    },
  ];

  return (
    <Layout>
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-24 left-12 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-24 right-12 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16 animate-fadeInDown">
            <Camera className="w-16 h-16 mx-auto mb-6 text-school-primary dark:text-school-accent animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">School Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
              Explore vibrant moments from our vocational programs, showcasing the skills and dedication of our students.
            </p>
          </div>

          <div className="space-y-16">
            {sections.map(({ title, description, images, icon: Icon, altPrefix }, index) => (
              <div
                key={title}
                className="bg-card/60 dark:bg-card/80 p-8 rounded-2xl shadow-xl hover-lift animate-fadeInUp"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-10 h-10 text-school-primary dark:text-school-accent" />
                      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                      {description}
                    </p>
                  </div>
                </div>
                <ImageGallery images={images} altPrefix={altPrefix} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SchoolGallery;
