import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { Link } from "react-router-dom";

// Variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const ServicesSection = () => {
  const services = [
    {
      icon: "📜",
      title: "Grievances",
      description: "File or track grievances related to civic services.",
      bg: "#F3E5F5",
      route: "/auth",
    },
    {
      icon: "📜",
      title: "Birth Certificate",
      description: "Apply or download your birth certificate online.",
      bg: "#F1EFFD",
      route: "/birth-certificate",
    },
    {
      icon: "⚰️",
      title: "Death Certificate",
      description: "Register and obtain death certificates easily.",
      bg: "#FFE7E7",
      route: "/services/death-certificate",
    },
    {
      icon: "💍",
      title: "Marriage Certificate",
      description: "Register and get your marriage certificate online.",
      bg: "#FFF3E4",
      route: "/services/marriage-certificate",
    },
    {
      icon: "🏠",
      title: "Property Tax",
      description: "Pay your property tax quickly and securely.",
      bg: "#E8F5E8",
      route: "/services/property-tax",
    },
    {
      icon: "💧",
      title: "Water Charges",
      description: "Manage and pay your water bills online.",
      bg: "#E0F7FA",
      route: "/services/water-charges",
    },
    {
      icon: "🗑️",
      title: "Solid Waste Management",
      description: "Track and pay for waste management services.",
      bg: "#FFF8E1",
      route: "/services/solid-waste",
    },
    
    {
      icon: "🍽️",
      title: "Restaurant License",
      description: "Apply for or renew restaurant licenses.",
      bg: "#FFF3E0",
      route: "/services/restaurant-license",
    },
  ];

  return (
    <section id="services">
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
            Choose a Service
          </motion.h2>
          <motion.p variants={fadeIn("up", 0.4)} className="text-gray-600">
            Access municipal services and complete your tasks easily.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <div
                className="w-24 h-24 rounded-full mb-6 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: service.bg }}
              >
                <span className="text-3xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-medium mb-3 text-center">
                {service.title}
              </h3>
              <p className="text-gray-500 text-center mb-6 flex-grow">
                {service.description}
              </p>
              <Link
                to={service.route}
                className="inline-block bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-full font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 hover:shadow-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </section>
  );
};

export default ServicesSection;
