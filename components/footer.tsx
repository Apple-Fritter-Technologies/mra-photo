import Image from "next/image";
import React from "react";
import Link from "next/link";
import { navigation } from "@/lib/data";
import { Facebook, Instagram, Mail, ChevronRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary to-primary/95 pt-12 pb-0 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Mobile logo top center */}
        <div className="md:hidden flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Maria Photography Logo"
            width={180}
            height={45}
            className="transition-all duration-300 hover:opacity-90"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* Logo and tagline - hidden on smallest screens since it's moved to top */}
          <div className="hidden md:flex flex-col items-center md:items-start">
            <Image
              src="/images/logo.png"
              alt="Maria Photography Logo"
              width={200}
              height={50}
              className="mb-5 transition-all duration-300 hover:opacity-90"
            />
            <p className="mt-3 max-w-xs text-center md:text-left  leading-relaxed opacity-80">
              Natural light, lifestyle photographer in the Metro Detroit area
              capturing your precious moments in a candid, crisp, and clean
              style.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-title mb-4 text-secondary text-2xl sm:text-3xl font-bold relative inline-block">
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full sm:after:w-1/2 after:h-[2px] after:bg-secondary/30">
                Quick Links
              </span>
            </h3>
            <nav className="flex flex-col space-y-3 w-full max-w-[200px]">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center hover:text-secondary transition-all duration-200 py-0.5"
                >
                  <ChevronRight
                    size={16}
                    className="mr-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                  />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact and social */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-title text-2xl sm:text-3xl font-bold mb-4 text-secondary relative inline-block">
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full sm:after:w-1/2 after:h-[2px] after:bg-secondary/30">
                Connect
              </span>
            </h3>
            <div className="flex flex-row space-x-6 mb-6">
              <Link
                href="https://www.facebook.com/profile.php?id=100084896798498&mibextid=zLoPMf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-secondary hover:text-primary rounded-full p-3 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/m.rose.a.photography"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-secondary hover:text-primary rounded-full p-3 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="mailto:m.rose.a.photography@gmail.com"
                className="bg-white/10 hover:bg-secondary hover:text-primary rounded-full p-3 transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </Link>
            </div>

            {/* Mobile-only tagline */}
            <p className="md:hidden mt-2 mb-5 max-w-xs text-center leading-relaxed opacity-80">
              Natural light, lifestyle photographer in the Metro Detroit area.
            </p>

            <div className="italic max-w-xs w-full text-center sm:text-left bg-white/5 p-4 rounded-lg border-l-2 border-secondary/50">
              <p className=" leading-relaxed">
                &quot;I have set the LORD always before me; because he is at my
                right hand, I will not be shaken.&quot;
                <span className="block mt-2 font-semibold text-secondary">
                  Psalm 16:8
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/80 w-full py-4 backdrop-blur-sm">
        <p className="text-white/90 text-center px-4 uppercase">
          © {new Date().getFullYear()} MRA Photography. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
