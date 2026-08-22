import type { Metadata } from "next";
import { ContactBanner } from "@/components/ContactBanner";
import { PageHero } from "@/components/PageHero";
import policy from "@/content/pages/privacy-policy.json";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Indofishmart",
  description: "Kebijakan privasi, syarat penggunaan, dan disclaimer website Indofishmart.",
  alternates: { canonical: "/privacy-policy-indofishmart-id/" },
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero
        eyebrow="INFORMASI WEBSITE"
        title="Kebijakan Privasi & Ketentuan"
        description="Informasi mengenai privasi, penggunaan situs, hak cipta, dan disclaimer Indofishmart."
      />
      <section className="section">
        <div className="container article-reading-layout policy-reading-layout">
          <div className="article-body" dangerouslySetInnerHTML={{ __html: policy.contentHtml }} />
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}
