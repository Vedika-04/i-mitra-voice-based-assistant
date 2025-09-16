import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import logo from "../assets/iMitraLogo.png";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About", href: "/#about" },
      { name: "Terms of Use", href: "/terms-of-use" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "How it Works", href: "/#services" },
      { name: "Contact Us", href: "/contact" },
    ],
    getHelp: [
      { name: "Support Career", href: "/support-career" },
      { name: "24h Service", href: "/#services" },
      { name: "Quick Chat", href: "/quick-chat" },
    ],
    support: [
      { name: "FAQs", href: "/faqs" },
      { name: "Policy", href: "/policy" },
      { name: "Business", href: "/business-support" },
    ],
    contact: [
      { name: "WhatsApp", href: "/contact/whatsapp" },
      { name: "Support 24", href: "/contact/support-24" },
    ],
  };

  return (
    <motion.footer
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      className="bg-gray-50"
    >
      <div className="section-container">
        <motion.div
          variants={fadeIn("up", 0.3)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div variants={fadeIn("right", 0.4)} className="lg:col-span-4">
            <img src={logo} alt="i-Mitra Logo" className="h-8 w-auto mb-4" />
            <motion.p
              variants={fadeIn("up", 0.6)}
              className="text-gray-600 mb-6"
            >
              Serving Citizens Through AI-Powered Smart Grievance Redressal
              System.
            </motion.p>
            <motion.div variants={fadeIn("up", 0.7)} className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaFacebookF className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Links Columns */}
          <motion.div variants={fadeIn("left", 0.4)} className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(
                ([category, links], categoryIndex) => (
                  <motion.div
                    key={category}
                    variants={fadeIn("up", 0.3 * (categoryIndex + 1))}
                  >
                    <motion.h3
                      variants={textVariant(0.2)}
                      className="text-lg font-medium mb-4 capitalize"
                    >
                      {category}
                    </motion.h3>
                    <motion.ul
                      variants={fadeIn("up", 0.4)}
                      className="space-y-3"
                    >
                      {links.map((link) => (
                        <motion.li
                          key={`${category}-${link.name}`}
                          variants={fadeIn("up", 0.1)}
                        >
                          <motion.a
                            whileHover={{ x: 5 }}
                            href={link.href}
                            className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 rounded"
                          >
                            {link.name}
                          </motion.a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
