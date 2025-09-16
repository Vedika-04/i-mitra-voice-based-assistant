import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

import { Link } from "react-router-dom";

// Variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  const features = [
    {
      icon: "🔍",
      title: "Citizen Login",
      description:
        "File new complaints, track existing grievances, and receive updates on resolution status across all government departments.",
      bg: "#F1EFFD",
      route: "/citizendashboard",
    },
    {
      icon: "⚙️",
      title: "MITRA Login",
      description:
        "Ground-level officers who receive, verify, and initiate action on citizen complaints within their assigned areas and departments.",
      bg: "#FFE7E7",
      route: "/mitra/login",
    },
    {
      icon: "🚀",
      title: "Department Officer Login",
      description:
        "Department heads and officers who review, process, and resolve complaints related to their specific government departments and services.",
      bg: "#FFF3E4",
      route: "/department",
    },
    {
      icon: "👑",
      title: "Super Admin Login",
      description:
        "System administrators with oversight access to monitor complaint resolution across all departments and ensure platform efficiency.",
      bg: "#E8F5E8",
      route: "/superadmin/login",
    },
  ];

  return (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      {/* Header */}
      <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-12">
        <motion.h2
          variants={textVariant(0.2)}
          className="text-3xl font-bold mb-4"
        >
          Who are you? Choose your login
        </motion.h2>
        <motion.p variants={fadeIn("up", 0.4)} className="text-gray-600">
          Access i-MITRA platform based on your role in the grievance redressal
          system
        </motion.p>
      </motion.div>

      {/* Features */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow"
          >
            <div
              className="w-24 h-24 rounded-full mb-6 flex items-center justify-center transition-transform duration-300 hover:scale-110"
              style={{ backgroundColor: feature.bg }}
              aria-hidden="true"
            >
              <span className="text-3xl">{feature.icon}</span>
            </div>
            <h3 className="text-xl font-medium mb-3 text-center">
              {feature.title}
            </h3>
            <p className="text-gray-500 text-center mb-6 flex-grow">
              {feature.description}
            </p>

            {/* Individual Login Button for each card */}
            <Link
              to={feature.route}
              className="inline-block bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-full font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 hover:shadow-lg"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                Login
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default FeaturesSection;
