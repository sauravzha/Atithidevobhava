import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export default function HomePage() {
  return (
    <div className="site-container py-12">
      <header className="border-b border-rule pb-8 mb-8">
        <Bi
          hindi="अतिथि देवो भवः"
          english="Atithi Devo Bhava"
          as="h1"
          className="mb-2"
        />
        <p className="font-heading text-lg text-secondary">
          Experience India through its people. | भारत को लोगों के साथ महसूस कीजिए।
        </p>
      </header>

      <section className="space-y-6 max-w-prose mb-12">
        <p className="text-base text-text leading-relaxed">
          Welcome to Atithi Devo Bhava. The platform design system, self-hosted Devanagari and Latin typography, accessible editorial UI components, and WCAG AA contrast verification suite are active.
        </p>
        <p className="text-sm text-secondary leading-relaxed">
          The following development pages provide testing for Devanagari conjuncts, responsive baselines, and complete component states:
        </p>
      </section>

      <div className="space-y-4">
        <div className="ruled-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-text">
              Typography and Devanagari Rendering Laboratory
            </h2>
            <p className="text-sm text-secondary">
              Tests complex conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध), matras, numerals, and mixed Hindi/English baselines at 320px, 768px, and 1280px.
            </p>
          </div>
          <Link
            href="/dev/type"
            className="tap-target px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm text-sm font-medium transition-colors duration-[120ms]"
          >
            Open /dev/type
          </Link>
        </div>

        <div className="ruled-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-text">
              Design System Component Catalog and WCAG AA Contrast Table
            </h2>
            <p className="text-sm text-secondary">
              Interactive catalog of all 18 editorial UI components, theme toggle, and automated contrast ratio verification proving WCAG 2.2 AA compliance.
            </p>
          </div>
          <Link
            href="/dev/components"
            className="tap-target px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm text-sm font-medium transition-colors duration-[120ms]"
          >
            Open /dev/components
          </Link>
        </div>
      </div>
    </div>
  );
}

