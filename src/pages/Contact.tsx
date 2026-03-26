import { Suspense, lazy } from "react";
import Layout from "@/components/Layout";

const ContactSection = lazy(() => import("@/components/ContactSection"));

export default function Contact() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-[900px]" aria-hidden="true" />}>
        <ContactSection />
      </Suspense>
    </Layout>
  );
}
