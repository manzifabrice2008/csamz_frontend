import { Suspense, lazy } from "react";
import Layout from "@/components/Layout";

const AboutSection = lazy(() => import("@/components/AboutSection"));

export default function About() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-[900px]" aria-hidden="true" />}>
        <AboutSection />
      </Suspense>
    </Layout>
  );
}
