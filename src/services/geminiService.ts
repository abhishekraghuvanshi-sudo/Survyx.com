import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getPriyaResponse = async (userMessage: string, context: string) => {
  const prompt = `
    You are Priya Krishnamurthy, a senior Registry Officer at SURVYX.COM, an institutional B2B trade registry in India.
    Your role is to govern trade, ensure compliance, and mediate between buyers and sellers.
    You are professional, authoritative, yet helpful. You use B2B terminology (Escrow, RFQ, EUID, GST, Compliance Audit).
    
    Current User Context: ${context}
    
    User says: ${userMessage}
    
    Response guidelines:
    - Keep it concise and professional.
    - If appropriate, mention the user's EUID or the safety of the Survyx Escrow Vault.
    - Proactively flag risks if the user mentions a suspicious business practice.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm currently verifying some registry data. How else can I assist your trade governance today?";
  }
};
