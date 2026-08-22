import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with telemetry header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    platform: "SURVYX.com",
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// AI Assistant Endpoint (Priya Krishnamurthy & Survyx Copilot)
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, context, mode = 'general' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: "Missing message payload" });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `
You are the Official AI Assistant for SURVYX.com — "The Global Marketplace to Connect, Consult, Buy, Sell & Grow with People, Process, and Technology."
Your persona is Officer Priya Krishnamurthy (Senior Registry Compliance & Trade Governance Specialist at SURVYX).

CORE MISSION & DOMAIN EXPERTISE:
1. CONNECT: Help verified buyers and suppliers match seamlessly across Renewable Energy, Heavy Manufacturing, Automotive & EV, Electronics, and Industrial Chemical sectors.
2. CONSULT: Provide advisory on trade specifications, Bill of Materials (BOM), NABL/ISO testing certifications, and market rate benchmarks.
3. BUY & SELL: Assist users in structuring high-converting RFQs (Request for Quotations), evaluating supplier bids, and creating transparent procurement contracts.
4. GROW: Guide businesses in upgrading their Entity Trust Score, scaling through NPCI/Bank-settled Multi-Signature Escrow Vaults, and unlocking zero-risk cross-border trade.

GOVERNANCE & ESCROW RULES:
- Explain Survyx 3-tier milestone Escrow: Material Intake (30%), Logistics GPS & e-Way Verification (40%), Final QA & Warranty handover (30%).
- Multi-signature security: Mutual sign-off required before liquidity release.
- Emergency Dispute Lock: When triggered, freezes funds under independent SURVYX mediation.
- Entity Verification: Levels include Standard (Draft), Gold (Verified GSTN/PAN/COI), and Platinum (Full Financial Clearance & Unlimited Vault volume).

Current User & Session Context:
${context || 'User is browsing the SURVYX Global B2B Marketplace.'}

RESPONSE GUIDELINES:
- Be clear, authoritative, highly professional, warm, and concise.
- Use formatting (bullet points, bold key terms) to make complex trade specs easy to scan.
- If the user asks about drafting an RFQ, provide structured fields (Title, Category, Quantity, Budget Range, Technical Specifications).
- If the user asks about Escrow or safety, assure them of dual-key multi-signature protection.
- Suggest actionable next steps where relevant (e.g., "Would you like me to populate this into your RFQ draft or check your Escrow milestone status?").
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || "I am reviewing the registry ledger. How may I assist your trade governance further?";
        res.json({ reply, source: 'gemini' });
        return;
      } catch (geminiError: any) {
        console.error("Gemini API call failed, falling back to smart rule engine:", geminiError?.message || geminiError);
      }
    }

    // Context-rich fallback engine if API key is not configured or temporary error occurs
    const lower = message.toLowerCase();
    let reply = "";

    if (lower.includes("rfq") || lower.includes("requirement") || lower.includes("buy") || lower.includes("sourcing")) {
      reply = `**SURVYX RFQ Structuring Assistant:**\n\nI can help you prepare an institutional-grade Request for Quotation:\n\n• **Category Match**: Renewable Energy, Automotive/EV, or Heavy Manufacturing.\n• **BOM Scope**: Ensure you attach NABL/ISO specification standards.\n• **Budget Guidance**: Typical industry batch contracts range between ₹15,00,000 to ₹45,00,000.\n• **Escrow Covenant**: All accepted bids are backed by 3-stage milestone release.\n\n*Tip: You can use the "Requirement Punching Form" on your Dashboard to publish this instantly to verified suppliers.*`;
    } else if (lower.includes("escrow") || lower.includes("vault") || lower.includes("payment") || lower.includes("money") || lower.includes("release")) {
      reply = `**SURVYX Escrow Vault Protection:**\n\nYour funds are locked in an audited multi-signature escrow architecture:\n\n1. **Milestone 1 (30%)**: Raw material intake & yard confirmation.\n2. **Milestone 2 (40%)**: Transit inspection synced with digital e-Way bill.\n3. **Milestone 3 (30%)**: Final QA testing, warranty sign-off, and site handover.\n\n*Both Buyer and Supplier keys are required to disburse any milestone. You can view or sign milestones in the Escrow Vault.*`;
    } else if (lower.includes("dispute") || lower.includes("issue") || lower.includes("delay") || lower.includes("freeze")) {
      reply = `**SURVYX Dispute & Mediation Protocol:**\n\nIf you experience delayed consignments or non-compliance with BOM specifications:\n\n• You can click **"Raise Dispute"** inside the Escrow Vault.\n• This instantly triggers a **Trade Lock** that halts all fund disbursements.\n• A Senior Registry Officer (like myself) is assigned to mediate within 24 hours to review delivery proofs or negotiate settlement.`;
    } else if (lower.includes("verification") || lower.includes("kyc") || lower.includes("gst") || lower.includes("pan") || lower.includes("trust")) {
      reply = `**Entity Verification & SURVYX Trust Score™:**\n\nTo achieve **Tier-1 Platinum Clearance** and unlock multi-crore escrow volume:\n\n1. **GSTIN Certificate**: Format verified via GSTN API.\n2. **PAN Card**: Entity / Signatory validation against NSDL.\n3. **Certificate of Incorporation (COI)**: MCA ROC cross-audit.\n\n*Your current entity progress can be monitored under the Entity Registry tab.*`;
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("who are you") || lower.includes("help")) {
      reply = `Greetings! I am **Priya Krishnamurthy**, Senior Registry Officer and your AI Trade Concierge at **SURVYX.com**.\n\nI can assist you with:\n• Structuring and publishing institutional **RFQs**\n• Managing **Multi-Signature Escrow Milestones**\n• Tracking **Entity KYC & Compliance Verification**\n• Direct supplier matchmaking & price benchmarking\n\nWhat would you like to explore today?`;
    } else {
      reply = `Thank you for your message. As your SURVYX Trade Officer, I am tracking your active session, EUID credentials, and live escrow balances.\n\nYou can ask me to draft technical BOM specifications, check compliance requirements, or explain the multi-signature release process for your active transactions.`;
    }

    res.json({ reply, source: 'offline-concierge' });
  } catch (error: any) {
    console.error("Assistant endpoint error:", error);
    res.status(500).json({ error: "Internal server error", message: error?.message || "Unknown error" });
  }
});

// Vite middleware for development vs Production build serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SURVYX Full-Stack Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
