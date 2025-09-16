import React from "react";
import { AlertTriangle, Gauge, Flame, Lightbulb } from "lucide-react";

// Map sections to icons + colors
const sectionConfig = {
  "Core Issues": {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
  "Performance Assessment": {
    icon: Gauge,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  Hotspots: {
    icon: Flame,
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  Recommendations: {
    icon: Lightbulb,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
};

// Parser function
function parseSummary(summary) {
  if (!summary) return {};

  const sections = {};
  // Liberal regex: match heading + content till next heading
  const regex =
    /(?:\d+\.\s*)?(?:\*\*)?\s*(Core Issues|Performance Assessment|Hotspots|Recommendations)\s*(?:\*\*)?\s*[:\-]*([\s\S]*?)(?=(?:\d+\.\s*)?(?:\*\*)?\s*(?:Core Issues|Performance Assessment|Hotspots|Recommendations)\s*(?:\*\*)?\s*[:\-]|$)/gi;

  let match;
  while ((match = regex.exec(summary)) !== null) {
    const [, heading, content] = match;
    sections[heading] = content.trim();
  }

  return sections;
}

const AISummary = ({ aiAnalysis }) => {
  if (!aiAnalysis?.aiSummary) {
    return (
      <p className="text-sm text-gray-500 italic">No summary available.</p>
    );
  }

  const parsedSections = parseSummary(aiAnalysis.aiSummary);

  return (
    <div>
      <h5 className="text-md font-semibold text-gray-700 mb-3">
        AI Analysis Summary
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(sectionConfig).map((section) => {
          const config = sectionConfig[section];
          const Icon = config.icon;

          return (
            <div
              key={section}
              className={`rounded-lg shadow-sm border p-4 ${config.bg}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <h6 className={`text-sm font-semibold ${config.color}`}>
                  {section}
                </h6>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {parsedSections[section] || "No data available"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AISummary;
