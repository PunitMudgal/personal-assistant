import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import { Tagline } from "@/components/sections/tagline";
import { Benefits } from "@/components/sections/benefits";
import { HowItWorks } from "@/components/sections/how-it-works";
import Feature from "@/components/sections/feature";
import { Proof } from "@/components/sections/proof";
import { Faq } from "@/components/sections/faq";
import Cta from "@/components/sections/cta";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Relay — your personal AI assistant",
  description:
    "Relay reads your inbox, checks your calendar, and pulls up your notes so you can just ask, instead of digging through five apps to find the answer.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Relay — your personal AI assistant",
    description:
      "Stop switching tabs. Start asking Relay. Gmail, Calendar, and Notion, read directly.",
    type: "website",
    images: [{ url: "/hero.png", width: 1024, height: 1365, alt: "Relay personal AI assistant" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Relay — your personal AI assistant",
    description:
      "Stop switching tabs. Start asking Relay. Gmail, Calendar, and Notion, read directly.",
    images: ["/hero.png"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Relay actually read?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Relay reads only what it needs to answer your question: the messages, events, and pages you ask about in Gmail, Google Calendar, and Notion. It does not scan your entire account up front.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Connection credentials are encrypted at rest and are never shown in the app. Relay does not sell your data and does not use your content for advertising. You can disconnect an integration or delete your account at any time, which removes stored conversations and memories.",
      },
    },
    {
      "@type": "Question",
      name: "Which accounts are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gmail, Google Calendar, and Notion today. More integrations are in progress during beta.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to copy paste context into the chat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Relay talks to your accounts directly, so you ask the question the way you would ask a colleague and it pulls the source itself.",
      },
    },
    {
      "@type": "Question",
      name: "Does Relay remember past conversations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every conversation persists, so you can ask about last week or last month and Relay still has the context without you restating it.",
      },
    },
    {
      "@type": "Question",
      name: "What does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Relay is free while in beta. No credit card is required to start. Pricing will be announced before the beta ends.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col bg-black text-white selection:bg-[#4CC2E9]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <Tagline />
      <Benefits />
      <HowItWorks />
      <Feature />
      <Proof />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
