import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-24">
        {/* Top Section: Logo and Description */}
        <div className="flex flex-col items-center gap-8 text-center">
          <Text className="text-4xl font-bold tracking-tight">Logo</Text>
          <Text className="max-w-[700px] text-sm leading-relaxed text-white/90">
            We are a trusted marketplace for buying and selling used
            electronics. Our platform connects buyers and sellers in a safe,
            transparent environment, focusing on direct communication and clear
            agreements through in-app chat. We don't handle payments or delivery
            — instead, we empower users to connect, negotiate, and close deals
            with confidence.
          </Text>
        </div>

        {/* Middle Section: Contact and Socials */}
        <div className="mt-12 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
          {/* Contact Us */}
          <div className="flex items-center gap-4 rounded-full border border-white/20 bg-white/10 px-6 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <Span className="text-xs text-white/70">Contact us at</Span>
              <Span className="text-sm font-medium">unreal@outlook.com</Span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-transform hover:scale-110"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-transform hover:scale-110"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-transform hover:scale-110"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-transform hover:scale-110"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom Section: Links and Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
            <a href="#" className="transition-colors hover:text-white">
              About us
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Contact
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacy policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Use
            </a>
          </div>
          <Span className="text-white/70">©All Rights Reserved</Span>
        </div>
      </div>
    </footer>
  );
};
