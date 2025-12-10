import { WebsiteFAQs } from "@/components/website/faqs";
import { CTA2 } from "@/components/website/cta-2";
import { WithWithout } from "@/components/website/with-without";
import Hero2 from "@/components/sections/hero-2";
import CTA1 from "@/components/website/cta-1";
import MonthlyAnnualPricing from "@/components/website/monthly-annual-pricing";
import TextRevealByWord from "@/components/ui/text-reveal";

export default function WebsiteHomepage() {
  return (
    <>
      <Hero2 />
      <CTA1 />
      <section id="features">
        <MonthlyAnnualPricing />
      </section>
      <TextRevealByWord text="Join thousands of users who are already boosting their productivity with BesideAI" />
      <WithWithout />
      <section id="pricing">
        <MonthlyAnnualPricing />
      </section>
      <WebsiteFAQs />
      <CTA2 />
    </>
  );
}
