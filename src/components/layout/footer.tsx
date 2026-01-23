import { Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6">
        {/* Logo */}
        <h2 className="text-h4 font-bold text-black">Logo</h2>

        {/* Description */}
        <p className="max-w-4xl text-center text-caption leading-relaxed text-muted-foreground">
          We are a trusted marketplace for buying and selling used electronics.
          Our platform connects buyers and sellers in a safe, transparent
          environment, focusing on direct communication and clear agreements
          through in-app chat. We don't handle payments or delivery — instead,
          we empower users to connect, negotiate, and close deals with
          confidence.
        </p>

        {/* Email Contact */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            <Mail className="h-5 w-5 text-gray-700" />
          </div>
          <div className="flex flex-col">
            <span className="text-caption text-gray-600">Contact us at</span>
            <a
              href="mailto:unreal@outlook.com"
              className="text-body font-medium text-black hover:text-primary"
            >
              unreal@outlook.com
            </a>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4">
          <a
            href="#facebook"
            aria-label="Facebook"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
          >
            <Facebook className="h-5 w-5 text-gray-700" />
          </a>
          <a
            href="#whatsapp"
            aria-label="WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
          >
            <FaWhatsapp className="h-5 w-5 text-gray-700" />
          </a>
          <a
            href="#instagram"
            aria-label="Instagram"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
          >
            <Instagram className="h-5 w-5 text-gray-700" />
          </a>
          <a
            href="#youtube"
            aria-label="YouTube"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
          >
            <Youtube className="h-5 w-5 text-gray-700" />
          </a>
        </div>

        {/* Footer Links and Copyright */}
        <div className="flex w-full flex-col items-center justify-center gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-caption sm:gap-6">
            <a
              href="#about"
              className="text-gray-600 transition-colors hover:text-black"
            >
              About us
            </a>
            <a
              href="#contact"
              className="text-gray-600 transition-colors hover:text-black"
            >
              Contact
            </a>
            <a
              href="#privacy"
              className="text-gray-600 transition-colors hover:text-black"
            >
              Privacy policy
            </a>
            <a
              href="#terms"
              className="text-gray-600 transition-colors hover:text-black"
            >
              Terms of Use
            </a>
          </nav>
          <p className="text-caption text-gray-600">©All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};
