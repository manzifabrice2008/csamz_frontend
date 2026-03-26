import { Suspense, lazy } from "react";
import Layout from "@/components/Layout";
import DeferredSection from "@/components/DeferredSection";
import SchoolHero from "@/components/SchoolHero";

const ProgramsSection = lazy(() => import("@/components/ProgramsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));

const Index = () => {
  return (
    <Layout>
      <SchoolHero />
      <DeferredSection minHeight={900}>
        <Suspense fallback={<div className="min-h-[900px]" aria-hidden="true" />}>
          <ProgramsSection />
        </Suspense>
      </DeferredSection>
      <DeferredSection minHeight={720}>
        <Suspense fallback={<div className="min-h-[720px]" aria-hidden="true" />}>
          <TestimonialsSection />
        </Suspense>
      </DeferredSection>
    </Layout>
  );
};

export default Index;
