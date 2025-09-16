import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const DepartmentsSection = () => {
  const departments = [
    {
      icon: "🏥",
      title: "Health & Medical",
      description: "Hospitals, medical services, healthcare complaints",
      bg: "#FFE7E7",
    },
    {
      icon: "🚰",
      title: "Water Supply",
      description: "Water shortage, quality, pipeline issues",
      bg: "#E7F3FF",
    },
    {
      icon: "⚡",
      title: "Electricity",
      description: "Power cuts, billing, line faults",
      bg: "#FFFDE7",
    },
    {
      icon: "🛣️",
      title: "Roads & Transport",
      description: "Road repairs, traffic, public transport",
      bg: "#F1EFFD",
    },
    {
      icon: "🎓",
      title: "Education",
      description: "Schools, colleges, educational services",
      bg: "#E8F5E8",
    },
    {
      icon: "🏛️",
      title: "Revenue",
      description: "Land records, certificates, property issues",
      bg: "#FFF3E4",
    },
    {
      icon: "👮",
      title: "Police",
      description: "Law & order, safety, crime reports",
      bg: "#FFE7E7",
    },
    {
      icon: "🌾",
      title: "Agriculture",
      description: "Farming, subsidies, crop insurance",
      bg: "#E7FFE7",
    },
    {
      icon: "💼",
      title: "Employment",
      description: "Job schemes, skill development, labor issues",
      bg: "#E7F3FF",
    },
    {
      icon: "🏠",
      title: "Housing",
      description: "Housing schemes, construction permits",
      bg: "#FFFDE7",
    },
    {
      icon: "🌳",
      title: "Environment",
      description: "Pollution, waste management, forest issues",
      bg: "#E8F5E8",
    },
    {
      icon: "💰",
      title: "Finance",
      description: "Banking, loans, financial schemes",
      bg: "#F1EFFD",
    },
  ];

  // Variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section id="departments" className="section-container px-4 md:px-0 py-16">
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-12">
          <motion.h2
            variants={textVariant(0.2)}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
          >
            Government Departments
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Select the relevant department to file your complaint or grievance
          </motion.p>
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {departments.map((department, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center mx-auto transition-transform duration-300"
                style={{ backgroundColor: department.bg }}
              >
                <span className="text-2xl">{department.icon}</span>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {department.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {department.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={fadeIn("up", 0.6)}
          className="text-center mt-12"
        ></motion.div>
      </motion.div>
    </section>
  );
};

export default DepartmentsSection;
