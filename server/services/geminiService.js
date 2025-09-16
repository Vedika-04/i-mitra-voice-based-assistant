// import { getGeminiModel } from "../config/gemini.js";

// class GeminiService {
//   constructor() {
//     this.model = getGeminiModel(); // Gemini generative model instance
//   }

//   // System prompt based on language & user type
//   getSystemPrompt(language, userType) {
//     const prompts = {
//       hi: {
//         citizen: `आप Dhwani-Mitra हैं - i-MITRA का voice assistant। नागरिकों को शिकायत दर्ज करने, स्थिति देखने में मदद करें। हमेशा सरल हिंदी/Hinglish में जवाब दें। Short और helpful responses दें।`,
//         officer: `आप i-MITRA प्लेटफॉर्म के विभागीय अधिकारियों के लिए AI सहायक हैं। शिकायत प्रबंधन और रिपोर्टिंग में सहायता करें। केवल हिंदी में जवाब दें।`,
//         fieldstaff: `आप i-MITRA के field staff (मित्र) के लिए AI सहायक हैं। शिकायत असाइनमेंट और समाधान प्रक्रिया में मार्गदर्शन दें। केवल हिंदी में जवाब दें।`,
//         admin: `आप i-MITRA के Super Admin के लिए AI सहायक हैं। प्लेटफ़ॉर्म मॉनिटरिंग और सपोर्ट में मदद करें। केवल हिंदी में जवाब दें।`,
//       },
//       en: {
//         citizen: `You are Dhwani-Mitra, the voice assistant for i-MITRA. Help citizens file complaints, check status, and get info. Respond in simple English or Hinglish. Keep responses short and helpful.`,
//         officer: `You are the AI assistant for departmental officers on i-MITRA. Assist in complaint management and reporting. Respond only in English.`,
//         fieldstaff: `You are the AI assistant for i-MITRA field staff (Mitra). Guide them in assignments and resolution. Respond only in English.`,
//         admin: `You are the AI assistant for i-MITRA Super Admin. Help with monitoring and platform support. Respond only in English.`,
//       },
//     };

//     return (
//       prompts[language]?.[userType] ||
//       prompts[language]?.citizen ||
//       prompts.hi.citizen
//     );
//   }

//   // Quick FAQ-style responses (fast path)
//   getQuickResponse(message, language) {
//     const quickResponses = {
//       hi: {
//         complaint_status:
//           "आप अपनी शिकायत की स्थिति Dashboard > 'मेरी शिकायतें' सेक्शन में देख सकते हैं।",
//         new_complaint:
//           "नई शिकायत दर्ज करने के लिए Dashboard > 'नई शिकायत' पर जाएं या voice से बोलें 'complaint file करना है'।",
//         departments:
//           "i-MITRA पर ये विभाग उपलब्ध हैं: सफाई, जल आपूर्ति, सड़क निर्माण, बिजली, स्वास्थ्य, पार्क्स।",
//         contact: "संपर्क करें: help@imitra-indore.gov.in | फोन: 0731-XXXXXXX",
//         help: "आप कह सकते हैं: 'Complaint file करना है', 'Status check करना है', 'Meri complaints dikhao'",
//       },
//       en: {
//         complaint_status:
//           "Check Dashboard > 'My Complaints' to view status and complaint ID.",
//         new_complaint:
//           "To file a new complaint: Dashboard → 'New Complaint' → fill in details or say 'file complaint'.",
//         departments:
//           "Available departments: Sanitation, Water, Roads, Electricity, Health, Parks.",
//         contact: "Contact: help@imitra-indore.gov.in | Phone: 0731-XXXXXXX",
//         help: "You can say: 'File complaint', 'Check status', 'Show my complaints'",
//       },
//     };

//     const text = message.toLowerCase();
//     if (text.includes("status") || text.includes("स्थिति"))
//       return quickResponses[language].complaint_status;
//     if (text.includes("complaint") || text.includes("शिकायत"))
//       return quickResponses[language].new_complaint;
//     if (text.includes("department") || text.includes("विभाग"))
//       return quickResponses[language].departments;
//     if (text.includes("contact") || text.includes("संपर्क"))
//       return quickResponses[language].contact;
//     if (text.includes("help") || text.includes("मदद") || text.includes("हेल्प"))
//       return quickResponses[language].help;
//     return null;
//   }

//   // Generate response via Gemini with PROPER ERROR HANDLING
//   async generateResponse(
//     message,
//     language = "hi",
//     context = "",
//     userType = "citizen"
//   ) {
//     try {
//       const systemPrompt = this.getSystemPrompt(language, userType);

//       const fullPrompt = [
//         systemPrompt,
//         context ? `\n\nConversation Context:\n${context}` : "",
//         `\n\nUser Message:\n${message}\n\nAssistant:`,
//       ].join("");

//       console.log(
//         "Sending prompt to Gemini:",
//         fullPrompt.substring(0, 200) + "..."
//       );

//       // Call Gemini API with error handling
//       const result = await this.model.generateContent(fullPrompt);

//       // DEBUG: Log full response structure
//       console.log(
//         "Full Gemini Response Structure:",
//         JSON.stringify(result, null, 2)
//       );

//       // SAFE RESPONSE EXTRACTION with multiple fallbacks
//       let responseText = "";

//       if (result && result.response) {
//         // Method 1: Try result.response.text() function
//         if (typeof result.response.text === "function") {
//           responseText = result.response.text();
//         }
//         // Method 2: Try result.response.text property
//         else if (result.response.text) {
//           responseText = result.response.text;
//         }
//         // Method 3: Try candidates array structure
//         else if (
//           result.response.candidates &&
//           result.response.candidates.length > 0
//         ) {
//           const candidate = result.response.candidates[0];
//           if (
//             candidate.content &&
//             candidate.content.parts &&
//             candidate.content.parts.length > 0
//           ) {
//             responseText = candidate.content.parts.text;
//           }
//         }
//         // Method 4: Direct access to parts
//         else if (result.response.parts && result.response.parts.length > 0) {
//           responseText = result.response.parts.text;
//         }
//       }
//       // Method 5: Try direct result.text
//       else if (result && typeof result.text === "function") {
//         responseText = result.text();
//       } else if (result && result.text) {
//         responseText = result.text;
//       }

//       // Final validation
//       if (!responseText || responseText.trim() === "") {
//         console.warn("No valid text found in Gemini response, using fallback");
//         return language === "hi"
//           ? "मुझे समझ नहीं आया। कृपया फिर से कहें।"
//           : "I didn't understand. Please try again.";
//       }

//       console.log(
//         "Successfully extracted response:",
//         responseText.substring(0, 100) + "..."
//       );
//       return responseText.trim();
//     } catch (err) {
//       console.error("Gemini API Error Details:", {
//         message: err.message,
//         stack: err.stack,
//         name: err.name,
//       });

//       // Handle specific error types
//       if (err.message && err.message.includes("quota")) {
//         return language === "hi"
//           ? "API quota खत्म हो गया। कृपया कुछ देर बाद try करें।"
//           : "API quota exceeded. Please try again later.";
//       }

//       if (err.message && err.message.includes("safety")) {
//         return language === "hi"
//           ? "Content blocked by safety filters. कृपया अलग तरीके से पूछें।"
//           : "Content blocked. Please rephrase your question.";
//       }

//       if (err.message && err.message.includes("network")) {
//         return language === "hi"
//           ? "Network error। कृपया internet connection check करें।"
//           : "Network error. Please check your connection.";
//       }

//       // Generic error fallback
//       throw new Error(`Failed to generate AI response: ${err.message}`);
//     }
//   }

//   // Context + quick replies
//   async getContextualResponse(
//     message,
//     userType,
//     language = "hi",
//     context = ""
//   ) {
//     // First try quick responses for common queries
//     const quick = this.getQuickResponse(message, language);
//     if (quick) {
//       console.log("Using quick response for:", message.substring(0, 50));
//       return quick;
//     }

//     // Fall back to Gemini generation
//     console.log("Using Gemini generation for:", message.substring(0, 50));
//     return this.generateResponse(message, language, context, userType);
//   }

//   // 🚀 Main method used by controller
//   async processMessage(
//     message,
//     conversationHistory = [],
//     userType = "citizen",
//     language = "hi"
//   ) {
//     try {
//       // Validate input
//       if (!message || typeof message !== "string" || message.trim() === "") {
//         return {
//           success: false,
//           error: "Invalid message input",
//           response:
//             language === "hi" ? "कृपया कुछ कहें।" : "Please say something.",
//         };
//       }

//       // Build context from conversation history
//       const context = conversationHistory
//         .slice(-3) // Last 3 messages only to avoid token limits
//         .map((msg) =>
//           typeof msg === "string" ? msg : `${msg.role}: ${msg.content}`
//         )
//         .join("\n");

//       console.log(
//         `Processing message: "${message}" for ${userType} in ${language}`
//       );

//       const responseText = await this.getContextualResponse(
//         message.trim(),
//         userType,
//         language,
//         context
//       );

//       return {
//         success: true,
//         response: responseText,
//         functionCalls: [], // Keep for future function calling
//       };
//     } catch (err) {
//       console.error("Gemini processMessage Error:", {
//         message: err.message,
//         userMessage: message?.substring(0, 50),
//         userType,
//         language,
//       });

//       return {
//         success: false,
//         error: err.message || "Unknown processing error",
//         response:
//           language === "hi"
//             ? "Technical problem आई है। कृपया कुछ देर बाद try करें।"
//             : "Technical problem occurred. Please try again later.",
//       };
//     }
//   }

//   // Enhanced function processing for future use
//   async processFunctionResponse(funcCall, args, language = "hi") {
//     try {
//       console.log("Processing function call:", funcCall, "with args:", args);

//       // This is where you'd integrate with your complaint tools
//       // For now, return a success message
//       const successMsg =
//         language === "hi"
//           ? "Function successfully execute हुआ।"
//           : "Function executed successfully.";

//       return {
//         success: true,
//         data: { message: successMsg },
//       };
//     } catch (err) {
//       console.error("Gemini functionCall Error:", err);
//       return {
//         success: false,
//         error: "Function execution failed",
//         data: {
//           message:
//             language === "hi"
//               ? "Function execute नहीं हुआ।"
//               : "Function execution failed.",
//         },
//       };
//     }
//   }
// }

// const geminiService = new GeminiService();
// export default geminiService;



import { getGeminiModel } from "../config/gemini.js";

class GeminiService {
  constructor() {
    this.model = getGeminiModel(); // Gemini generative model instance
  }

  // =========================
  // ✅ EXISTING METHODS (UNCHANGED)
  // =========================

  // System prompt based on language & user type
  getSystemPrompt(language, userType) {
    const prompts = {
      hi: {
        citizen: `आप Dhwani-Mitra हैं - i-MITRA का voice assistant। नागरिकों को शिकायत दर्ज करने, स्थिति देखने में मदद करें। हमेशा सरल हिंदी/Hinglish में जवाब दें। Short और helpful responses दें।`,
        officer: `आप i-MITRA प्लेटफॉर्म के विभागीय अधिकारियों के लिए AI सहायक हैं। शिकायत प्रबंधन और रिपोर्टिंग में सहायता करें। केवल हिंदी में जवाब दें।`,
        fieldstaff: `आप i-MITRA के field staff (मित्र) के लिए AI सहायक हैं। शिकायत असाइनमेंट और समाधान प्रक्रिया में मार्गदर्शन दें। केवल हिंदी में जवाब दें।`,
        admin: `आप i-MITRA के Super Admin के लिए AI सहायक हैं। प्लेटफ़ॉर्म मॉनिटरिंग और सपोर्ट में मदद करें। केवल हिंदी में जवाब दें।`,
      },
      en: {
        citizen: `You are Dhwani-Mitra, the voice assistant for i-MITRA. Help citizens file complaints, check status, and get info. Respond in simple English or Hinglish. Keep responses short and helpful.`,
        officer: `You are the AI assistant for departmental officers on i-MITRA. Assist in complaint management and reporting. Respond only in English.`,
        fieldstaff: `You are the AI assistant for i-MITRA field staff (Mitra). Guide them in assignments and resolution. Respond only in English.`,
        admin: `You are the AI assistant for i-MITRA Super Admin. Help with monitoring and platform support. Respond only in English.`,
      },
    };

    return (
      prompts[language]?.[userType] ||
      prompts[language]?.citizen ||
      prompts.hi.citizen
    );
  }

  // Quick FAQ-style responses (fast path)
  getQuickResponse(message, language) {
    const quickResponses = {
      hi: {
        complaint_status:
          "आप अपनी शिकायत की स्थिति Dashboard > 'मेरी शिकायतें' सेक्शन में देख सकते हैं।",
        new_complaint:
          "नई शिकायत दर्ज करने के लिए Dashboard > 'नई शिकायत' पर जाएं या voice से बोलें 'complaint file करना है'।",
        departments:
          "i-MITRA पर ये विभाग उपलब्ध हैं: सफाई, जल आपूर्ति, सड़क निर्माण, बिजली, स्वास्थ्य, पार्क्स।",
        contact: "संपर्क करें: help@imitra-indore.gov.in | फोन: 0731-XXXXXXX",
        help: "आप कह सकते हैं: 'Complaint file करना है', 'Status check करना है', 'Meri complaints dikhao'",
      },
      en: {
        complaint_status:
          "Check Dashboard > 'My Complaints' to view status and complaint ID.",
        new_complaint:
          "To file a new complaint: Dashboard → 'New Complaint' → fill in details or say 'file complaint'.",
        departments:
          "Available departments: Sanitation, Water, Roads, Electricity, Health, Parks.",
        contact: "Contact: help@imitra-indore.gov.in | Phone: 0731-XXXXXXX",
        help: "You can say: 'File complaint', 'Check status', 'Show my complaints'",
      },
    };

    const text = message.toLowerCase();
    if (text.includes("status") || text.includes("स्थिति"))
      return quickResponses[language].complaint_status;
    if (text.includes("complaint") || text.includes("शिकायत"))
      return quickResponses[language].new_complaint;
    if (text.includes("department") || text.includes("विभाग"))
      return quickResponses[language].departments;
    if (text.includes("contact") || text.includes("संपर्क"))
      return quickResponses[language].contact;
    if (text.includes("help") || text.includes("मदद") || text.includes("हेल्प"))
      return quickResponses[language].help;
    return null;
  }

  // Generate response via Gemini with PROPER ERROR HANDLING
  async generateResponse(
    message,
    language = "hi",
    context = "",
    userType = "citizen"
  ) {
    try {
      const systemPrompt = this.getSystemPrompt(language, userType);

      const fullPrompt = [
        systemPrompt,
        context ? `\n\nConversation Context:\n${context}` : "",
        `\n\nUser Message:\n${message}\n\nAssistant:`,
      ].join("");

      console.log(
        "Sending prompt to Gemini:",
        fullPrompt.substring(0, 200) + "..."
      );

      // Call Gemini API with error handling
      const result = await this.model.generateContent(fullPrompt);

      // DEBUG: Log full response structure
      console.log(
        "Full Gemini Response Structure:",
        JSON.stringify(result, null, 2)
      );

      // SAFE RESPONSE EXTRACTION with multiple fallbacks
      let responseText = "";

      if (result && result.response) {
        if (typeof result.response.text === "function") {
          responseText = result.response.text();
        } else if (result.response.text) {
          responseText = result.response.text;
        } else if (
          result.response.candidates &&
          result.response.candidates.length > 0
        ) {
          const candidate = result.response.candidates[0];
          if (
            candidate.content &&
            candidate.content.parts &&
            candidate.content.parts.length > 0
          ) {
            responseText = candidate.content.parts.text;
          }
        } else if (result.response.parts && result.response.parts.length > 0) {
          responseText = result.response.parts.text;
        }
      } else if (result && typeof result.text === "function") {
        responseText = result.text();
      } else if (result && result.text) {
        responseText = result.text;
      }

      if (!responseText || responseText.trim() === "") {
        console.warn("No valid text found in Gemini response, using fallback");
        return language === "hi"
          ? "मुझे समझ नहीं आया। कृपया फिर से कहें।"
          : "I didn't understand. Please try again.";
      }

      console.log(
        "Successfully extracted response:",
        responseText.substring(0, 100) + "..."
      );
      return responseText.trim();
    } catch (err) {
      console.error("Gemini API Error Details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });

      if (err.message && err.message.includes("quota")) {
        return language === "hi"
          ? "API quota खत्म हो गया। कृपया कुछ देर बाद try करें।"
          : "API quota exceeded. Please try again later.";
      }

      if (err.message && err.message.includes("safety")) {
        return language === "hi"
          ? "Content blocked by safety filters. कृपया अलग तरीके से पूछें।"
          : "Content blocked. Please rephrase your question.";
      }

      if (err.message && err.message.includes("network")) {
        return language === "hi"
          ? "Network error। कृपया internet connection check करें।"
          : "Network error. Please check your connection.";
      }

      throw new Error(`Failed to generate AI response: ${err.message}`);
    }
  }

  // Context + quick replies
  async getContextualResponse(
    message,
    userType,
    language = "hi",
    context = ""
  ) {
    const quick = this.getQuickResponse(message, language);
    if (quick) {
      console.log("Using quick response for:", message.substring(0, 50));
      return quick;
    }

    console.log("Using Gemini generation for:", message.substring(0, 50));
    return this.generateResponse(message, language, context, userType);
  }

  // 🚀 Main method used by controller
  async processMessage(
    message,
    conversationHistory = [],
    userType = "citizen",
    language = "hi"
  ) {
    try {
      if (!message || typeof message !== "string" || message.trim() === "") {
        return {
          success: false,
          error: "Invalid message input",
          response:
            language === "hi" ? "कृपया कुछ कहें।" : "Please say something.",
        };
      }

      const context = conversationHistory
        .slice(-3) // Last 3 messages only to avoid token limits
        .map((msg) =>
          typeof msg === "string" ? msg : `${msg.role}: ${msg.content}`
        )
        .join("\n");

      console.log(
        `Processing message: "${message}" for ${userType} in ${language}`
      );

      const responseText = await this.getContextualResponse(
        message.trim(),
        userType,
        language,
        context
      );

      return {
        success: true,
        response: responseText,
        functionCalls: [], // Keep for future function calling
      };
    } catch (err) {
      console.error("Gemini processMessage Error:", {
        message: err.message,
        userMessage: message?.substring(0, 50),
        userType,
        language,
      });

      return {
        success: false,
        error: err.message || "Unknown processing error",
        response:
          language === "hi"
            ? "Technical problem आई है। कृपया कुछ देर बाद try करें।"
            : "Technical problem occurred. Please try again later.",
      };
    }
  }

  // Enhanced function processing for future use
  async processFunctionResponse(funcCall, args, language = "hi") {
    try {
      console.log("Processing function call:", funcCall, "with args:", args);

      const successMsg =
        language === "hi"
          ? "Function successfully execute हुआ।"
          : "Function executed successfully.";

      return {
        success: true,
        data: { message: successMsg },
      };
    } catch (err) {
      console.error("Gemini functionCall Error:", err);
      return {
        success: false,
        error: "Function execution failed",
        data: {
          message:
            language === "hi"
              ? "Function execute नहीं हुआ।"
              : "Function execution failed.",
        },
      };
    }
  }

  // =========================
  // 🆕 ADD-ON: SERVICE FORM FILLING (Birth/Death/Marriage/License/Tax/Water)
  // (No changes to old methods above)
  // =========================

  /** Identify which municipal service the user is talking about */
  detectServiceIntent(message = "") {
    const text = (message || "").toLowerCase();

    if (text.includes("birth certificate") || text.includes("जन्म प्रमाण"))
      return "birthCertificate";
    if (text.includes("death certificate") || text.includes("मृत्यु प्रमाण"))
      return "deathCertificate";
    if (text.includes("marriage") || text.includes("विवाह"))
      return "marriageCertificate";
    if (text.includes("trade license") || text.includes("व्यापार लाइसेंस"))
      return "tradeLicense";
    if (text.includes("property tax") || text.includes("संपत्ति कर"))
      return "propertyTax";
    if (text.includes("water connection") || text.includes("जल कनेक्शन"))
      return "waterConnection";

    // Also allow explicit mentions like "service: birthCertificate"
    const match = text.match(/service\s*:\s*([a-zA-Z]+)/);
    if (match) return match[1];

    return null;
  }

  /** JSON schema for each service */
  getFormSchema(serviceName) {
    const schemas = {
      birthCertificate: {
        fullName: "",
        dob: "",            // YYYY-MM-DD
        fatherName: "",
        motherName: "",
        placeOfBirth: "",
      },
      deathCertificate: {
        deceasedName: "",
        dod: "",            // YYYY-MM-DD
        placeOfDeath: "",
        fatherOrHusbandName: "",
        address: "",
      },
      marriageCertificate: {
        husbandName: "",
        wifeName: "",
        marriageDate: "",   // YYYY-MM-DD
        placeOfMarriage: "",
      },
      tradeLicense: {
        applicantName: "",
        businessName: "",
        businessType: "",
        address: "",
        startDate: "",      // YYYY-MM-DD
      },
      propertyTax: {
        ownerName: "",
        propertyId: "",
        address: "",
        ward: "",
      },
      waterConnection: {
        applicantName: "",
        address: "",
        ward: "",
        connectionType: "", // domestic/commercial
      },
    };
    return schemas[serviceName] || {};
  }

  /** Simple date normalizer: converts things like "5 January 2001" → "2001-01-05" (best-effort) */
  normalizeDate(str = "") {
    if (!str) return "";
    try {
      const d = new Date(str);
      if (isNaN(d.getTime())) return "";
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return "";
    }
  }

  /** Build strict prompt for extraction */
  buildServiceExtractionPrompt(serviceName, language = "hi") {
    const schema = JSON.stringify(this.getFormSchema(serviceName), null, 2);
    const langLine =
      language === "hi"
        ? "सिर्फ VALID JSON return करें, कोई extra text/markdown नहीं। तारीख YYYY-MM-DD में हो।"
        : "Return ONLY VALID JSON (no extra text/markdown). Dates must be in YYYY-MM-DD.";

    return `
You are an assistant that extracts structured data for municipal service forms.

Service: ${serviceName}

Output JSON schema EXACTLY as:
${schema}

Rules:
- ${langLine}
- If a field is not mentioned, use empty string "" (or [] where applicable).
- Don't infer unknown values; leave them empty.
- Prefer parsing Indian names and places accurately.
- Input may be in Hindi/English/Hinglish. Handle both.

Return ONLY JSON.
`.trim();
  }

  /** Robust JSON text extractor (handles if model accidentally adds prose) */
  safeJsonParse(maybeJson = "{}") {
    try {
      // Try direct parse
      return JSON.parse(maybeJson);
    } catch {
      // Try to grab first {...} block
      const match = maybeJson.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          return {};
        }
      }
      return {};
    }
  }

  /** Call Gemini to extract form data from speechText for a given service */
  async extractFormData(serviceName, speechText, language = "hi") {
    const systemPrompt = this.buildServiceExtractionPrompt(
      serviceName,
      language
    );
    const userPrompt = `User said:\n"""${speechText}"""`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}\n`;
    const result = await this.model.generateContent(fullPrompt);

    const raw =
      (result?.response && typeof result.response.text === "function"
        ? result.response.text()
        : result?.response?.text) ||
      (typeof result?.text === "function" ? result.text() : result?.text) ||
      "{}";

    console.log("🔎 Raw service JSON (may include prose):", raw?.slice(0, 400));

    const data = this.safeJsonParse(raw);

    // Minimal post-normalization for known date fields
    const dateKeys = [
      "dob",
      "dod",
      "marriageDate",
      "startDate",
    ];
    for (const k of dateKeys) {
      if (k in data) data[k] = this.normalizeDate(data[k]);
    }

    // Ensure all schema keys exist
    const schema = this.getFormSchema(serviceName);
    return { ...schema, ...data };
  }

  /**
   * Public: Try to process a message as a service request.
   * - If service intent detected → returns { success:true, mode:'service', service, formData }
   * - Else → { success:false, reason:'no_service_detected' }
   * (Old chat flow remains separate in processMessage)
   */
  async processServiceRequest(
    message,
    language = "hi"
  ) {
    const service = this.detectServiceIntent(message || "");
    if (!service) {
      return { success: false, reason: "no_service_detected" };
    }

    const formData = await this.extractFormData(service, message, language);
    return {
      success: true,
      mode: "service",
      service,
      formData,
    };
  }

  /**
   * OPTIONAL convenience: Try service first, else fallback to old chat flow,
   * without touching the original processMessage.
   */
  async processServiceOrChat(
    message,
    conversationHistory = [],
    userType = "citizen",
    language = "hi"
  ) {
    const asService = await this.processServiceRequest(message, language);
    if (asService.success) return asService;

    // Fall back to the original chat pipeline
    return this.processMessage(message, conversationHistory, userType, language);
  }
}

const geminiService = new GeminiService();
export default geminiService;
