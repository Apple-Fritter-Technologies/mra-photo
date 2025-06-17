"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import Link from "next/link";

import { Facebook, Instagram, Mail, ChevronRight } from "lucide-react";
import { allHomeNavigation } from "@/lib/data";
import { useUserStore } from "@/store/use-user";

const Footer = () => {
  const { token } = useUserStore();

  const footerNavigation = useMemo(() => {
    if (token) {
      return allHomeNavigation
        .filter((item) => item.name !== "Login")
        .concat([{ name: "Account", href: "/account" }]);
    }
    return allHomeNavigation;
  }, [token]);

  return (
    <footer className="bg-gradient-to-b from-primary to-primary/95 pt-12 pb-0 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Mobile logo top center */}
        <div className="md:hidden flex flex-col items-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Maria Photography Logo"
            width={180}
            height={45}
            className="transition-all duration-300 hover:opacity-90"
          />
          <p className="mt-3 max-w-xs text-center leading-relaxed opacity-80">
            Natural light, lifestyle photographer in the Metro Detroit area
            capturing your precious moments in a candid, crisp, and clean style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-12">
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
              {footerNavigation.map((item) => (
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

            <div className="italic max-w-xs w-full text-center sm:text-left bg-white/5 p-4 rounded-lg border-l-2 border-secondary/50">
              <p className=" leading-relaxed">
                &quot;For by him all things were created, in heaven and on
                earth, visible and invisible, whether thrones or dominions or
                rulers or authorities—all things were created through him and
                for him.&quot;
                <span className="block mt-2 font-semibold text-secondary">
                  Colossians 1:16 ESV
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
