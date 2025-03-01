'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function FamilyHubLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#FF3366]"
    >
      <path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12h6v10M12 7a2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-12 flex items-center"
        >
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <FamilyHubLogo />
              <div className="absolute inset-0 bg-[#FF3366]/20 rounded-lg filter blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              FamilyHub
            </span>
          </Link>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center space-x-6"
        >
          <Link
            href="/features"
            className="text-white/80 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="text-white/80 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-white/80 hover:text-white transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm"
          >
            Login
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}