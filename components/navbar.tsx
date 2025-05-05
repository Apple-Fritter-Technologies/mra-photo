"use client";

import { navItems } from "@/lib/data";
import { useUserStore } from "@/store/use-user";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import UserDropdown from "./user-dropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { token } = useUserStore();

  // Filter navigation items to exclude Login when user is logged in
  const navigation = token
    ? navItems.filter((item) => item.name !== "Login")
    : navItems;

  // Split navigation items into two halves
  const midpoint = Math.ceil(navigation.length / 2);
  const leftNavigation = navigation.slice(0, midpoint);
  const rightNavigation = navigation.slice(midpoint);

  return (
    <div className="flex justify-center w-full mx-auto items-center px-4 md:pt-8 pt-4 gap-6 fixed top-0 z-50">
      <div className="bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-between md:w-fit md:px-6 px-4 md:py-4 py-2 relative z-20 w-full gap-4">
        {/* Logo - always visible */}
        <Link
          href="/"
          className="md:absolute left-1/2 transform md:-translate-x-[40%]"
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="rounded-full w-20 h-20 md:w-24 md:h-24"
            priority
          />
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {/* Desktop navigation */}
          <div className="flex gap-6">
            {leftNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-900 hover:text-secondary font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* image fill blank object */}
          <div className="w-[100px] h-[2px]" />

          <div className="flex gap-6 items-center">
            {rightNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-900 hover:text-secondary font-medium"
              >
                {item.name}
              </Link>
            ))}

            {/* User icon with dropdown when logged in */}
          </div>
        </div>
        {/* Hamburger button for mobile */}
        {token && (
          <div className="ml-auto">
            <UserDropdown />
          </div>
        )}

        <button
          className="relative z-20 focus:outline-none md:hidden mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <div className="flex flex-col justify-center items-center w-6 h-6">
            <span
              className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ease-out
                ${isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ease-out my-0.5
                ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ease-out
                ${
                  isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-primary/80 backdrop-blur-sm z-10 transition-opacity duration-300 ease-in-out md:hidden
          ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`absolute top-32 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg z-20 transition-all duration-300 ease-in-out transform md:hidden
          ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col gap-4 py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-900 hover:text-secondary font-medium px-4 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
