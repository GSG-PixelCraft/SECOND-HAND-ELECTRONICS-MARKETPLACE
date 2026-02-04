import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Facebook,
  Globe,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/span";
import { Text } from "@/components/ui/text";

type Tab = "faq" | "contact";

const FAQ_ITEMS = [
  {
    question: "What is this app?",
    answer:
      "This app is a marketplace for buying and selling used electronics in a safe and simple way.",
  },
  {
    question: "How does it work?",
    answer:
      "Users can post listings, browse products, chat with sellers, and complete transactions securely.",
  },
  {
    question: "How do I post a listing?",
    answer:
      "Go to your dashboard and click 'Create listing', then upload photos and product details.",
  },
  {
    question: "How can I contact a seller?",
    answer:
      "Open the product page and use the built-in chat feature to message the seller directly.",
  },
  {
    question: "What should I do if I face a problem?",
    answer:
      "Contact customer service through the Help Center or report the issue from your account.",
  },
];

export const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState<Tab>("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="rounded-lg border border-neutral-20 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-neutral-foreground">
        Help Center
      </h2>

      <div className="mb-6 flex rounded-full border border-neutral-20 p-1">
        <Button
          onClick={() => setActiveTab("faq")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
            activeTab === "faq"
              ? "bg-primary text-white"
              : "text-muted-foreground"
          }`}
        >
          FAQ
        </Button>

        <Button
          onClick={() => setActiveTab("contact")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
            activeTab === "contact"
              ? "bg-primary text-white"
              : "text-muted-foreground"
          }`}
        >
          Contact us
        </Button>
      </div>

      {activeTab === "faq" && (
        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className="rounded-lg border border-neutral-20 bg-white p-4 shadow-sm"
              >
                <Button
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <Span className="font-medium text-neutral-foreground">
                    {item.question}
                  </Span>

                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>

                {isOpen && (
                  <Text variant="muted" className="mt-3">
                    {item.answer}
                  </Text>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "contact" && (
        <div className="flex flex-col gap-4">
          {[
            { label: "Customer Service", icon: Headphones },
            { label: "Facebook", icon: Facebook },
            { label: "Website", icon: Globe },
            { label: "Instagram", icon: Instagram },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-lg border border-neutral-20 bg-white p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 text-primary">
                  <Icon size={18} />
                </div>

                <Span variant="body" className="font-medium">
                  {item.label}
                </Span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
