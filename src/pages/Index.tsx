import Layout from "@/components/Layout";
import SchoolHero from "@/components/SchoolHero";
import ProgramsSection from "@/components/ProgramsSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <Layout>
      <SchoolHero />
      <ProgramsSection />
      <TestimonialsSection/>
    </Layout>
  );
};

export default Index;
